var color = (function() {
    
    function colorize(color) {
        return function(string) {
            return "\u001B[" + {  
                bold: 1,
                black : 30,
                red : 31,
                green : 32,
                yellow : 33,
            }[color] + 'm' + string + "\u001B[0m";
        };
    };
    
    return {
        red : colorize('red'),
        green: colorize('green'),     
        yellow: colorize('yellow'),
        bold: colorize('bold')
    }
})();

module.exports = color;