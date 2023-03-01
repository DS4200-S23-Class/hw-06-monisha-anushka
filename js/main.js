// create frame constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 400; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 



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

// read in  data
d3.csv("data/iris.csv").then((data) => { 


    //  creating petal length vs. sepal length scatter
	// find max of x and y values for the first scatter plot
	const MAX_X1 = d3.max(data, (d) => { return parseFloat(d.Sepal_Length); });
	const MAX_Y1 = d3.max(data, (d) => { return parseFloat(d.Petal_Length); });

	// create scales to map x and y values to pixels/scale to determine color based on species
	const X_SCALE = d3.scaleLinear() 
	                    .domain([0, (MAX_X1 + 2)]) 
	                    .range([0, VIS_WIDTH]); 
	const Y_SCALE = d3.scaleLinear() 
	                    .domain([0, (MAX_Y1 + 2)]) 
	                    .range([VIS_HEIGHT, 0]); 

    const color = d3.scaleOrdinal()
                        .domain(["setosa", "versicolor", "virginica"])
                        .range([ "blue", "green", "red"]);

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
            .style("fill", (d) => {return color(d.Species);})
            .attr("class", "point")
           

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
    

        // petal width vs. sepal width scatter plot
        //find max x and y for scatter plot
        const MAX_X2 = d3.max(data, (d) => { return parseFloat(d.Sepal_Width); });
        const MAX_Y2 = d3.max(data, (d) => { return parseFloat(d.Petal_Width); });
         
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
            .attr("class", "point")
    
        
    // create const for the brush based on the size of the frame
    const BRUSH = d3.brush()
                        .extent([ [0,0], [FRAME_WIDTH,FRAME_HEIGHT] ])
                        .on("start brush", brushed);
                        //.on("end", () => { });
       

    // create function to change appearance of bars + points when brushing
    function brushed(event) {

        
        const selection = event.selection;

        // determine if points were selected in frame 2 to highlight according points in that + other scatter plot
        point2.classed("selectedPoint", (d) => { return isBrushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ); });
        point1.classed("selectedPoint", (d) => { return isBrushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ); });
        bars.classed("selectedPoint", (d) => { return isBrushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ); });
            
       
       }; 
    
    // function to determine whether points are within the brushing frame
    function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;  
     };

       
  

    // call brush
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

    
    // bar chart based on species
    // hard code amounts of each species
	const MAX_AMT = 50;


    // create scale  for y scale 
	const AMT_SCALE = d3.scaleLinear() 
	                    .domain([MAX_AMT + 10, 0]) 
	                    .range([0, VIS_HEIGHT]); 

	// create x axis scale based on category names
    const CATEGORY_SCALE = d3.scaleBand() 
                .domain(data.map((d) => { return d.Species; })) 
                .range([0, VIS_WIDTH])
                .padding(.2); 


    // plot bar based on data with rectangle svgs 
	var bars = FRAME3.selectAll("bar")  
        .data(data) 
        .enter()       
        .append("rect")  
          .attr("y", (d) => { return AMT_SCALE(MAX_AMT) + MARGINS.bottom; }) 
          .attr("x", (d) => { return CATEGORY_SCALE(d.Species) + MARGINS.left;}) 
          .attr("height", (d) => { return VIS_HEIGHT - AMT_SCALE(MAX_AMT); })
          .attr("width", CATEGORY_SCALE.bandwidth())
          .style("fill", (d) => {return color(d.Species); })
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