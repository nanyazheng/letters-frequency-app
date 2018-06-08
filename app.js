
let width = 800;
let height = 400;
let barPadding = 10;
let svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

d3.select("form")
    .on("submit", function() {
        d3.event.preventDefault();
        let input = d3.select("input");
        let text = input.property("value");
        let data = getFrequencies(text);
        let barWidth = width / data.length -  barPadding;
        let letters = d3.select("svg")
                        .selectAll(".letter")
                        .data(data, d => d.character);
        letters.classed("new", false)
                .exit()
                .remove()
        let letterEnter = letters.enter()
                .append("g")
                .classed("new", true)
                .classed("letter", true)
        letterEnter.append("rect");
        letterEnter.append("text");
        
        letterEnter.merge(letters)
                .select("rect")
                .style("width", barWidth)
                .style("height", function(d) {
                    return d.count * 20;
                })
                .attr("x", function(d, i) {
                    return (barWidth + barPadding) * i;
                })
                .attr("y", function(d) {
                    return height - (d.count * 20);
                })
        letterEnter.merge(letters)
                .select("text")
                .attr("x", function(d, i) {
                    return (barPadding + barWidth) * i + (barWidth / 2);
                })
                .attr("text-anchor", "middle")
                .attr("y", function(d) {
                    return height -  (d.count * 20) - 10;
                })
                .text(function(d, i) {
                    return d.character;
                })
        d3.select("#phrase")
            .text(`Analysis of ${text}`);
        d3.select("#count")
            .text(`(New Characters: ${letters.enter().nodes().length})`)
        input.property("value", "");
    })

d3.select("#reset")
    .on("click", function() {
        d3.select("#phrase")
            .text("");
        d3.select("#count")
            .text("");
        d3.selectAll(".letter")
            .remove();
    })

function getFrequencies(text) {
    let data = [];
    let sorted = text.split("").sort();
    for (let i of sorted) {
        let last = data[data.length - 1];
        if (last && last.character == i) {
            last.count++;
        } else {
            data.push({character: i, count: 1});
        }
    }
    return data;
}

