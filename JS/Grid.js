function Block(k, x, y) {
    // Objet representant le bloc entrain de tomber que le joueur controle
    this.blocks = [];
    this.x = x;
    this.y = y;
    this.k = k;

    for (var i = 0; i < k; i++) {
        var randColor = colors[Math.floor(Math.random() * colors.length)];
        this.blocks.push(randColor);
    }

}

function Grid() {

    this.width = 6;
    this.height = 12;
    this.score = 0;

    /*this.grid = [
        ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white"]
    ];*/

    this.grid = [];

    for (var i = 0; i < this.width; i++) { // Initialiser la grille vide
        this.grid.push([]);
        for (var j = 0; j < this.height; j++) {
            this.grid[i].push("white");
        }
    }

    this.draw = function() {
        context.strokeStyle = "black";
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                context.strokeRect(i * tile_width + delta, j * tile_height + delta, tile_width, tile_height);
                context.fillStyle = this.grid[i][this.grid[i].length - j - 1];
                context.fillRect(i * tile_width + delta, j * tile_height + delta, tile_width, tile_height);

            }
        }

        context.fillStyle = "black";
        context.font = "30px Serif";
        context.fillText(this.score, this.width * tile_width + 3 * delta, this.height * tile_height / 2);
    };

    this.canFall = function() {
        /* Verifie si l'une des cases au moins peut tomber, renvoie false si tous est tassé et qu'il n'y a pas de bloc entrain de tomber
         */
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 1; j < this.grid[i].length; j++) {

                if (this.grid[i][j] != "white" && this.grid[i][j - 1] == "white") {
                    return true;
                }
            }
        }
        //this.score++;
        return false;
    }

    this.fall = function() {
        /* Fait descendre tous les blocs qui le peuvent d'une case (dont notamment le bloc entrain de tomber)
         */
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {

                if (this.grid[i][j - 1] == "white") {
                    this.grid[i][j - 1] = this.grid[i][j];
                    this.grid[i][j] = "white";
                }
            }
        }
        if (this.block)
            this.block.y--;
    };

    this.fastFall = function() {
        /* Tasse toute la grille (dont le bloc entrain de tomber s'il existe)
         */
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {

                if (this.grid[i][j] != "white") {
                    var a = 1;
                    while (j - a >= 0 && this.grid[i][j - a] == "white")
                        a++;
                    a--;

                    if (a > 0) {
                        this.grid[i][j - a] = this.grid[i][j];
                        this.grid[i][j] = "white";
                    }
                }
            }
        }
    };



    this.newBlock = function() {
        /* Ajoute un bloc aleatoire dans une colonne de la grille
         */
        k = Math.floor(Math.random() * 3) + 3;
        canAdd = []
        for (var i = 0; i < this.grid.length; i++) {
            if (this.canAddBlock(i, k))
                canAdd.push(i);
        }

        if (canAdd.length == 0)
            return false;

        var randCol = canAdd[Math.floor(Math.random() * canAdd.length)];

        this.block = new Block(k, randCol, this.grid[randCol].length - 1 - k + 1);

        for (var i = 0; i < k; i++) {
            this.grid[randCol][this.grid[randCol].length - 1 - i] = this.block.blocks[i];
        }

        return true;
    };

    this.canAddBlock = function(i, k) {
        /* Verifie si on peut ajouté un bloc de longueur k au sommet de la colonne i
         */
        for (var j = this.grid[i].length - 1; j > this.grid[i].length - 1 - k; j--) {
            if (this.grid[i][j] != "white")
                return false;
        }
        return true;
        //return this.grid[i][this.grid[i].length - 1] == "white";
    };

    this.moveBlock = function(dir) {
        /* Deplace le bloc entrain de tomber vers la droite ou la gauche
         */
        if (!this.block)
            return false;

        var x = this.block.x;
        var newX = x + dir;
        var y = this.block.y;

        if (newX >= 0 && newX < this.width) {
            for (var i = 0; i < this.block.k; i++) {
                if (this.grid[newX][y + i] != "white")
                    return false;
            }

            this.block.x = newX;
            for (var i = 0; i < this.block.k; i++) {
                this.grid[newX][y + i] = this.grid[x][y + i];
                this.grid[x][y + i] = "white";
            }

        }
    };

    this.scoreRow = function(g, i, j, dx, dy) {
        /* Argument : les coordonnées (i,j) d'une case de la grille et une direction (dx,dy) (valant -1, 0 ou 1)
        Return : le nombre de points marqués et la grille avec les cases vidées
        */
        var score = 0;
        var row = [];
        for (var a = 0; i + a * dx < this.width && i + a * dx >= 0 && j + a * dy >= 0 && j + a * dy < this.height; a++) {
            row.push(g[i + a * dx][j + a * dy]);
        }
        var evaluation = evaluateRow(row);
        var marking = evaluation["marking"];
        score += evaluation["score"];

        for (var a = 0; a < marking.length; a++) {
            if (marking[a]) {
                g[i + a * dx][j + a * dy] = "white";
            }
        }
        return { g: g, score: score };
    };

    this.clearRow = function() {
        /* Return : g la grille mise à jour où toutes les cases appartenant à un alignement sont vides
        et le nombre de points obtenus pour les alignements presents dans la grille
        */
        var points = 0;
        var g = this.grid;

        // Allignements colonnes
        var g1 = copyArray(this.grid);
        for (var i = 0; i < this.width; i++) {
            var evaluation = this.scoreRow(g1, i, 0, 0, 1);
            g1 = evaluation["g"];
            points += evaluation["score"];
        }

        // Allignements colonnes
        var g2 = copyArray(this.grid);
        for (var i = 0; i < this.height; i++) {
            var evaluation = this.scoreRow(g2, 0, i, 1, 0);
            g2 = evaluation["g"];
            points += evaluation["score"];
        }

        if (this.height > this.width) {
            // Allignements diagonaux1
            var g3 = copyArray(this.grid);
            for (var i = 0; i < this.height; i++) {
                var evaluation = this.scoreRow(g3, 0, i, 1, 1);
                g3 = evaluation["g"];
                points += evaluation["score"];
            }
            for (var i = 1; i < this.width; i++) {
                var evaluation = this.scoreRow(g3, i, 0, 1, 1);
                g3 = evaluation["g"];
                points += evaluation["score"];
            }

            // Allignements diagonaux2
            var g4 = copyArray(this.grid);
            for (var i = 0; i < this.height; i++) {
                var evaluation = this.scoreRow(g4, 0, i, 1, -1);
                g4 = evaluation["g"];
                points += evaluation["score"];
            }
            for (var i = 1; i < this.width; i++) {
                var evaluation = this.scoreRow(g4, i, this.height, 1, -1);
                g4 = evaluation["g"];
                points += evaluation["score"];
            }
        }

        // Modifier la grille
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (g1[i][j] == "white" || g2[i][j] == "white" || g3[i][j] == "white" || g4[i][j] == "white") {
                    g[i][j] = "white";
                }
            }
        }

        this.grid = copyArray(g);
        this.score += points;
        var n = (points == 0);

        return { g: g, points: points, nothing: (points == 0) };

    };

    this.evaluateAndUpdate = function() {
        var score = 0;

        bool = false;
        do {
            var a = gridd.clearRow();
            this.draw();
            gridd.fastFall();
            this.draw();
            bool = a["nothing"];
            console.log(bool);
        } while (bool == false);

        this.score += score;
        return score;
    }

}

function evaluateRow(row) {
    /*Argument : un tableau a 1 dimension
    Return : Un tableau de booleens tel que res[a]=true si row[a] appartient à un alignement unicolore de longuer au moins 3
    et le nombres de points obtenus pour les alignements présents */
    var res = [],
        score = 0;
    var i = 0;
    while (i < row.length) {
        var j = 1;
        while (i + j < row.length && row[i + j] == row[i]) // Parcourt le tableau en detectant les changements de couleurs
            j++;
        if (j >= 3 && row[i] != "white") {
            score += j - 2;
            for (var a = 0; a < j; a++) {
                res.push(true);
            }
        } else {
            for (var a = 0; a < j; a++) {
                res.push(false);
            }
        }
        i += j;
    }
    return {
        marking: res,
        score: score
    };

}

function copyArray(tab) {
    grid = [];

    for (var i = 0; i < tab.length; i++) { // Initialiser la grille vide
        grid.push([]);
        for (var j = 0; j < tab[i].length; j++) {
            grid[i].push(tab[i][j]);
        }
    }
    return grid;
}