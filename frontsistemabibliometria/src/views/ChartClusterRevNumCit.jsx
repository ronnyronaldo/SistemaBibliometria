import React, { Component } from 'react';
import * as d3 from 'd3';
import { color, scaleLinear, scaleBand, range } from 'd3';

class Barchar extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentDidMount() {
        // set the dimensions and margins of the graph
        const {data, w, h, nr, nc } = this.props;
        var margin = {top: 20, right: 20, bottom: 40, left: 60},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

        // create svg element, respecting margins
        var svg = d3.select(this.myRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear().domain([0, nr]).range([0, width]);
        svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear().domain([0, nc]).range([ height, 0]);
        svg
        .append("g")
        .call(d3.axisLeft(y));

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("Revista");

        // Y axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Número de Citaciones")

        const xScale = scaleLinear().domain([0, nr]).range([0, width])
        const yScale = scaleLinear().domain([0, nc]).range([height, 0])
        function color(cluster){
            if (cluster == 0) return "blue"
            if (cluster == 1) return "green"
            if (cluster == 2) return "orange"
            if (cluster == 3) return "red"
            if (cluster == 4) return "cyan"
        }

        var dot = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.revista))
        .attr("cy", d => yScale(d.num_citations))
        .attr("r", d => 5)
        .attr("fill", d => color(d.id_cluster))
        .attr( "fill-opacity", 0.4 )
        // .on("click", function(){ 
        //     if (dot.attr("fill") === "red") dot.attr("fill", "blue");
        //     else dot.attr("fill", "red");
        //   });

        // var dot1 = svg.selectAll(".dodo")
        //   .data(data)
        //  .enter().append("text")
        //   .attr("class", "dodo")
        //   .attr("x", function(d) { return xScale(d.id_area_unesco); })
        //   .attr("y", function(d) { return yScale(d.id_area_frascati); })
        //   .attr("dx", ".71em")
        //   .attr("dy", ".35em")
        //   .text(function(d) { return "Tania";})
        //dot.on('click' , function(d){ console.log("Hola"); });


    }
    render() {
        return <>
            <div ref={this.myRef}></div>
        </>
    }
}

export default Barchar;