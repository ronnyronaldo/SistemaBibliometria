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
        const {data, w, h, af, au, totales} = this.props;
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
        var x = d3.scaleLinear().domain([0, au]).range([0, width-150]);
        svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear().domain([0, af]).range([ height, 0]);
        svg
        .append("g")
        .call(d3.axisLeft(y));

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width-150)
        .attr("y", height + margin.top + 20)
        .text("Area Unesco");

        // Y axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Area Frascati")
        
        const xScale = scaleLinear().domain([0, au]).range([0, width-150])
        const yScale = scaleLinear().domain([0, af]).range([height, 0])
        function color(cluster){
            if (cluster == 0) return "blue"
            if (cluster == 1) return "green"
            if (cluster == 2) return "orange"
            if (cluster == 3) return "red"
            if (cluster == 4) return "black"
            if (cluster == 5) return "cyan"
            if (cluster == 6) return "pink"
        }

        function nombre(cluster){
            if (cluster == 0) return "Cluster 1 (" + totales[0]+")"
            if (cluster == 1) return "Cluster 2 (" + totales[1]+")"
            if (cluster == 2) return "Cluster 3 (" + totales[2]+")"
            if (cluster == 3) return "Cluster 4 (" + totales[3]+")"
            if (cluster == 4) return "Cluster 5 (" + totales[4]+")"
            if (cluster == 5) return "Cluster 6 (" + totales[5]+")"
            if (cluster == 6) return "Cluster 7 (" + totales[6]+")"
        }

        var dot = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.id_area_unesco))
        .attr("cy", d => yScale(d.id_area_frascati))
        .attr("r", d => 5)
        .attr("fill", d => color(d.id_cluster))
        .attr( "fill-opacity", 0.4 )
                        
        var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", w - 65)
        .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);

        const valor = [0,1,2,3,4,5,6];
        legend.selectAll('g').data(valor)
        .enter()
        .append('g')
        .each(function(d, i) {
            var g = d3.select(this);
            g.append("rect")
            .attr("x", width-110)
            .attr("y", i*25)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color(d));
  
            g.append("text")
            .attr("x", width-90)
            .attr("y", i * 25 + 8)
            .attr("height",10)
            .attr("width",10)
            .style("fill", "black")
            .text(nombre(d));

        });
    }
    render() {
        return <>
            <div ref={this.myRef}></div>
        </>
    }
}

export default Barchar;