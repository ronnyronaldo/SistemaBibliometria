import React, { Component } from 'react';
import * as d3 from 'd3';
import { color, scaleLinear, scaleBand, range } from 'd3';

class Barchar extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentDidMount() {
        const paises = [{pais:"Afghanistan", habitantes: 31889923, continente: "Asia", esperanzaVida: 43.8, poderAdquisitivo: 974.58},
                        {pais:"Albania", habitantes: 3600523, continente: "Europa", esperanzaVida: 76.4, poderAdquisitivo: 5937.03},
                        {pais:"Algeria", habitantes: 33333216, continente: "Africa", esperanzaVida: 72.3, poderAdquisitivo: 6223.37},
                        {pais:"Angola", habitantes: 12420476, continente: "Africa", esperanzaVida: 42.7, poderAdquisitivo: 4797.23},
                        {pais:"Argentina", habitantes: 40301927, continente: "America", esperanzaVida: 75.3, poderAdquisitivo: 12779.38},
                        {pais:"Australia", habitantes: 104341176, continente: "Oceania", esperanzaVida: 81.2, poderAdquisitivo: 34435.37}];

        const {w, h } = this.props;
        const xScale = scaleLinear()
        .domain([-5000, 50000])
        .range([0, h])
        const yScale = scaleLinear()
        .domain([0, 150])
        .range([w, 0])
        const areaScale = scaleLinear()
        .domain([0, 40301927])
        .range([0, 20])

        function color(nombre){
            if (nombre == "Europa"){
                return "red"
            }
            if (nombre == "Africa"){
                return "tomato"
            }
            if (nombre == "America"){
                return "yellow"
            }
            if (nombre == "Oceania"){
                return "black"
            }
            if (nombre == "Asia"){
                return "green"
            }
        }

        const accessToRef = d3.select(this.myRef.current)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background-color", "#cccccc")
            .style("padding", 10)
            .style("margin-left", 50)

        accessToRef.selectAll("circle")
            .data(paises)
            .enter()
            .append("circle")
            .attr("cx", pais => xScale(pais.poderAdquisitivo))
            .attr("cy", pais => yScale(pais.esperanzaVida))
            .attr("r", pais => areaScale(pais.habitantes))
            .attr("fill", pais => color(pais.continente))
    }

    render() {
        return <>
            <div ref={this.myRef}>Testing Refs</div>
        </>
    }
}

export default Barchar;