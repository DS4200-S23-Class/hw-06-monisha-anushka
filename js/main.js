// create frame constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 400; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


//  creating scatter plot
// frame1 to append svgs to 
const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

//frame2 to append svgs to
const FRAME2 = d3.select("#vis2") 
                    .append("svg") 
                      .attr("height", FRAME_HEIGHT)   
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame");
//frame3 to append svgs to
const FRAME3 = d3.select("#vis3") 
                    .append("svg") 
                      .attr("height", FRAME_HEIGHT)   
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame"); 

// read in scatter data
d3.csv("data/iris.csv").then((data) => { 

	// find max of x and y values for the first scatter plot
	const MAX_X1 = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
	const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

	// create scales to map x and y values to pixels 
	const X_SCALE = d3.scaleLinear() 
	                    .domain([0, (MAX_X1 + 2)]) 
	                    .range([0, VIS_WIDTH]); 
	const Y_SCALE = d3.scaleLinear() 
	                    .domain([0, (MAX_Y1 + 2)]) 
	                    .range([VIS_HEIGHT, 0]); 

    const color = d3.scaleOrdinal()
                        .domain(["setosa", "versicolor", "virginica" ])
                        .range([ "blue", "green", "red"])

	// append svg circle points based on data
        var point1 = FRAME1.append("g")
        .   selectAll("point")  
            .data(data) 
            .enter()       
            .append("circle")  
            .attr("cx", (d) => { return (X_SCALE(d.Sepal_Length) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE(d.Petal_Length) + MARGINS.bottom); })
            .attr("r", 5)
            .style('opacity', 0.5)
            .style("fill", (d) => {return color(d.Species)})
            .attr("class", "point");
    

    

        // add x axis
	FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
               "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE)) 
            .attr("font-size", '7px'); 

        // add y axis
        FRAME1.append("g") 
            .attr("transform", "translate(" + (MARGINS.left) + 
                 "," + (MARGINS.top) + ")") 
            .call(d3.axisLeft(Y_SCALE)) 
            .attr("font-size", '10px');
    
        //constants for Frame2
        const MAX_X2 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
        const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });
         
        // create scales to map x and y values to pixels 
        const X_SCALE2 = d3.scaleLinear() 
                                 .domain([0, (MAX_X2 + 2)]) 
                                 .range([0, VIS_WIDTH]); 
        const Y_SCALE2 = d3.scaleLinear() 
                                 .domain([0, (MAX_Y2 + 2)]) 
                                 .range([VIS_HEIGHT, 0]);

        
    
        //adding points to frame2
        var point2 = FRAME2.append("g")
            .selectAll("circle")  
            .data(data) 
            .enter()       
            .append("circle")  
            .attr("cx", (d) => { return (X_SCALE2(d.Sepal_Width) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE2(d.Petal_Width) + MARGINS.bottom); })
            .attr("r", 5)
            .style('opacity', 0.5)
            .style("fill", (d) => {return color(d.Species); })
            .attr("class", "point");
        
     
    const BRUSH = d3.brush()
                        .extent([ [0,0], [FRAME_WIDTH,FRAME_HEIGHT] ])
                        .on("start brush", brushed);
       

    function brushed(event) {

        
        const selection = event.selection;
        point2.classed("selectedPoint", (d) => { return isBrushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ) })
        point1.classed("selectedPoint", (d) => { return isBrushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ) })
        //bars.classed("selectedBar", (d) => { return color(d.Species) == color(d[
       
       }; 
    
        function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  };

       
    FRAME2.call(BRUSH);

     
    
        // add x axis
	FRAME2.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
               "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE)) 
            .attr("font-size", '7px'); 

        // add y axis
         FRAME2.append("g") 
            .attr("transform", "translate(" + (MARGINS.left) + 
                 "," + (MARGINS.top) + ")") 
            .call(d3.axisLeft(Y_SCALE)) 
            .attr("font-size", '10px');

    
        // bar chart
        // create y axis scale based on amount column

	const MAX_AMT = 50

    var speciesArray = [{species: 'setosa', count: 50}, {species: 'versicolor', count: 50}, {species: 'virginica', count: 50}];

	         
	const AMT_SCALE = d3.scaleLinear() 
	                    .domain([MAX_AMT + 10, 0]) 
	                    .range([0, VIS_HEIGHT]); 

	// create x axis scale based on category names
        const CATEGORY_SCALE = d3.scaleBand() 
                    .domain(data.map((d) => { return d.Species; })) 
                    .range([0, VIS_WIDTH])
                    .padding(.2); 


        // plot bar based on data with rectangle svgs 
		var bars = FRAME3.append("g")
            .selectAll("bar")  
	        .data(speciesArray) 
	        .enter()       
	        .append("rect")  
	          .attr("y", (d) => { return AMT_SCALE(d.count) + MARGINS.bottom; }) 
	          .attr("x", (d) => { return CATEGORY_SCALE(d.species) + MARGINS.left;}) 
	          .attr("height", (d) => { return VIS_HEIGHT - AMT_SCALE(d.count); })
	          .attr("width", CATEGORY_SCALE.bandwidth())
              .style('opacity', 0.5)
              .style("fill", (d) => {return color(d.species)})
	          .attr("class", "bar");



	 // append x axis 
	 FRAME3.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(CATEGORY_SCALE))
          .attr("font-size", '20px'); 

  // append y axis
	FRAME3.append("g") 
	      .attr("transform", "translate(" + (MARGINS.left) + 
	            "," + (MARGINS.top) + ")") 
	      .call(d3.axisLeft(AMT_SCALE).ticks(10)) 
	        .attr("font-size", '20px');


        
});