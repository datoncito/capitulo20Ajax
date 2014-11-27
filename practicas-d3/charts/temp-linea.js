/**
 * Created by campitos on 26/11/14.
 */




    /* Primero cargamos los datos de campitos-ley */
angular.module("exampleApp",["ngResource"])
    .controller("ctrlExample",function($scope, $http,$resource){
        $scope.temperaturas=[];
        $scope.horitatemper=null;
        $scope.horita=null;

        var Temperatura=$resource('http://campitos-ley.whelastic.net/uv/servicios/estacion/temperatura',{id:'@id'},
            { creadito: { method: "POST" }, salvate: { method: "PUT" }});
        var valores=Temperatura.query(function() {
            console.log("tamano:" + valores.length);
            /*
             PRIMERO DEFINIMOS LAS ESCALAS
             */
            var data=[valores];
            var width= 780,
                height =500,
                margin=30;
            var d = new Date();
            var horas = d.getHours();
            //definimos escalas
            var x=d3.scale.linear()
                // .domain([new Date(2014,10,23),new Date()])
                .domain([0, 23])
                .range([margin, width- margin]);

            var y=d3.
                scale.linear()
                .domain([2,28])
                .range([height-margin, margin]); //ponemos el cuerpo donde se va a pintar todo


            //Luego definimos  las lineas
            var line=d3.svg.line()
                .interpolate('monotone')
                .x(function(d){return x(d.hora);})
                .y(function(d){return y(d.temperatura);});

            //habilitamos el svg

            var svg=d3.select("div.grafica-temp-linea").append("svg");

            //Las dimensiones de nuestro lienzo
            svg.attr("width", width).attr("height",height);

            //Habilitamos el path
            /*
             El path es para que pinte la linea con la union dada en var line;
             */
            svg.selectAll("path")
                .data(data)
                .enter()
                .append("path")
                .attr("class","line")
                .attr("d",function(d){return line(d);});



            //Llamamos nuestros ejes :)

           // renderDots(svg);
           renderActual(svg);
            crearEjes(svg);
            /*


             /* TERMINA LA GRAFICA*/

            /* Inicialziamos los valores y el actual*/

            for (i = 0; i < valores.length; i++) {
                var d = new Date();
                var horas = d.getHours();
                var minutos = d.getMinutes();
                if (valores[i].hora === horas) {
                    $scope.horitatemper = valores[i].temperatura;
                    $scope.horita = horas + ":" + minutos;
                    console.log($scope.horitatemper + " a la hora " + $scope.horita);
                }
                // console.log(valores[i].hora+"hora:"+n);
                data[i] = valores[i].temperatura;
            }


            //Funcion donde se crean los ejes

            function crearEjes(svg){
                var xAxis= d3.svg
                    .axis()
                    .scale(x.range([0, cuadrantWidth()]))
                    .ticks(24)
                    .orient("bottom");
                var yAxis=d3.svg.axis()
                    .
                    scale(y.range([cuadrantHeight(),0]))
                    .orient(
                    "left");
                //Pintamos los ejes
                // verificamos la fecha para poner en el eje el valor de la temm
                var d = new Date();
                var horas = d.getHours();
                var valorcin=(cuadrantWidth()/24)*(horas);

                svg.append("g")
                    .attr(
                    "class","axis")
                    .attr(
                    "transform", function(){
                        return "translate("+xStart()+","+yStart()+
                            ")"
                    }).call(xAxis)
                    .append("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("x", cuadrantWidth())
                    .attr("dy", "-0.5em")
                    .style("text-anchor", "end")
                    .text("Hora del día (24 hrs.)");




                //Las siguientes son las grids en X
                d3.selectAll("g.axis g.tick") // <-B
                    .append("line") // <-C
                    .classed("grid-line", true)
                    .attr("x1", 0) // <-D
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", - (height - 2 * margin)); // <-E


                svg.append("g")
                    .attr("class","axis")
                    .attr(
                    "transform", function(){
                        return "translate("+
                            xStart()+"," + yEnd()+")"
                    }).call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Temperatura (ºC)");



                // La siguiente es la grid en Y
                d3.selectAll("g.axis g.tick")
                    .append("line")
                    .classed("grid-line", true)
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2",cuadrantWidth() ) // <-F
                    .attr("y2", 0);



            }


            function renderDots(svg){ // <-B
                data.forEach(function(list){

                        svg.append("g").selectAll("circle")
                            .data(list)
                            .enter().append("circle") // <-C
                            .attr("class", "dot")
                            .attr("cx", function (d) {
                                return x(d.hora);
                            })
                            .attr("cy", function (d) {
                                return y(d.temperatura);
                            })
                            .attr("r", 4.5);

                });
            }
function renderActual(svg){

    data.forEach(function(list){

        svg.append("g").selectAll("circle")
            .data(list)
            .enter().append("circle") // <-C
            .filter(function(d) { return d.hora == horas })
            .attr("class", "dot")
            .attr("cx", function (d) {
                return x(d.hora);
            })
            .attr("cy", function (d) {
                return y(d.temperatura);
            })
            .attr("r", 5.5);

    });

}



            //Definimos las funciones para usarse en la creacion de los ejes

            function xStart(){
                return margin;
            }

            function xEnd(){
                return width-margin
                    ;
            }

            function yStart(){
                return height- margin;
            }

            function yEnd(){
                return margin;
            }

            function cuadrantWidth(){

                return width- margin*2;
            }

            function cuadrantHeight(){
                return height - margin *2;
            }



        }) });
