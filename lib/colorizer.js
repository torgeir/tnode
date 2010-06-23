var colorizer = function(string, color) {
    return "\u001B[" + {
        black : 30,
        red : 31,
        green : 32,
    }[color] + 'm' + string + "\u001B[0m";
};

module.exports = colorizer;