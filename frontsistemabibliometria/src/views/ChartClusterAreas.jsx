import React, { Component } from 'react';
import * as d3 from 'd3';
import { color, scaleLinear, scaleBand, range } from 'd3';

class Barchar extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentDidMount() {

        var margin = {top: 20, right: 20, bottom: 40, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        const {data, w, h } = this.props;
        //console.log("Valor")
        //console.log(data)
        const xScale = scaleLinear()
        .domain([-5, 41])
        .range([0, h])
        const yScale = scaleLinear()
        .domain([-7, 25])
        .range([w, 0])
        const areaScale = scaleLinear()
        .domain([0, 7])
        .range([0, 7])

        function color(nombre){
            //console.log(nombre)
            if (nombre == 0){
                return "blue"
            }
            if (nombre == 1){
                return "green"
            }
            if (nombre == 2){
                return "orange"
            }
            if (nombre == 3){
                return "red"
            }
            if (nombre == 4){
                return "black"
            }
            if (nombre == 5){
                return "gray"
            }
        }

        const accessToRef = d3.select(this.myRef.current)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background-color", "#FFFFFF")
            .style("padding", 10)
            .style("margin-left", 50)

        accessToRef.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.id_area_frascati))
            .attr("cy", d => yScale(d.id_area_unesco))
            .attr("r", d => 5)
            .attr("fill", d => color(d.id_cluster))
      
        var yscale = d3.scaleLinear()
        .domain([0, 41])
        .range([h, 0]);

        var y_axis = d3.axisLeft(yscale);
        accessToRef.append("g")
        .attr("transform", "translate(50, 5)")
        .call(y_axis)

        var xscale = d3.scaleLinear()
            .domain([0, 25])
            .range([0, w]);
  
        var x_axis = d3.axisBottom(xscale);
  
        accessToRef.append("g")
            .attr("transform", "translate(50,460)")
            .call(x_axis)
        
        

        /*accessToRef.append('g')
        .attr('transform', 'translate(' + margin.left + ',0')
        .call(d3.axisLeft(y))
        accessToRef.append('g')
        .attr('transform', 'translate(' + margin.left + ',0')
        .call(d3.axisBottom(x))*/
    }

    render() {
        return <>
            <div ref={this.myRef}></div>
        </>
    }
}

export default Barchar;