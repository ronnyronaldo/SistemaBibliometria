import React, { Component } from 'react';
import * as d3 from 'd3';
import { validacionInputService } from '../_services/validacionInput.service';
import { color, scaleLinear, scaleBand, range } from 'd3';

class Barchar extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentDidMount() {
        // set the dimensions and margins of the graph
        const {data, w, h, nr, nc, totales} = this.props;
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
        var x = d3.scaleLinear().domain([0, nr]).range([0, width-150]);
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
        .attr("x", width - 150)
        .attr("y", height + margin.top + 20)
        .text("Revista");

        // Y axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Número de Citaciones")

        const xScale = scaleLinear().domain([0, nr]).range([0, width-150])
        const yScale = scaleLinear().domain([0, nc]).range([height, 0])
        
        function color(cluster){
            for (var i = 0; i< totales.length ; i++){
                if(cluster == i) return validacionInputService.valorColor(i+1)
            }
        }

        function nombre(cluster){
            for (var  i = 0; totales.length; i++){
                if(cluster == i) return "Cluster "+i+" (" + totales[i]+")"
            }
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
        
        var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", w - 65)
        .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);

        let leyenda = []
        for (var j = 0; j < totales.length; j++){
            leyenda.push(j)
        }

        legend.selectAll('g').data(leyenda)
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