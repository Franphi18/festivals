var isMobile = window.screen.width < 400 ? true : false;

if(isMobile) {
	d3.selectAll(".mobile").style("display", "inline-block");
	d3.selectAll(".desktop").style("display", "none");
	d3.selectAll(".outer-margin").style("margin-left", "10px").style("margin-right", "10px");
	d3.selectAll(".title").style("font-size", "2.7em");
	// d3.selectAll(".heart").style("font-size", "1.4em");
} else {

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Set up the SVG ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	var margin = {
	  top: 10,
	  right: 150,
	  bottom: 0,
	  left: -350
	};
	var widthOriginal = 2150 - 100 - 150;
	var width = 1700 - margin.left - margin.right;
	var height = 1000 - margin.top - margin.bottom;
		
	//SVG container
	var svg = d3.select('#chart')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g").attr("class", "top-wrapper")
		.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");	


	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create the scales //////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	
	
	var yearScale = d3.scaleLinear()
		.domain([1939, 2016])
	    .range([0, widthOriginal]);
		
	var rScale = d3.scaleSqrt()
		.domain([1,10,25,50,100,250,500,1000,2000])
		.range([25,21,17,13,10,7,5,3,2]);
		
	var colorScale = d3.scaleLinear()
		.domain([1,2,3,4,5])
		.range(["#ADDFE0","#6FBDB3","#189195","#0E708A","#0D5072"]);

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// Select most voted Artists //////////////////////////
	///////////////////////////////////////////////////////////////////////////
			
	var interestingSongs = [
		1989, //Oldest song - Billy Holiday
		363, //Highest song from 2016 - Can't Stop The Feeling | Justin Timberlake
		270, //Highest new song - Starman | David Bowie
		144, //Highest riser - When We Were Young | Adele
		232, //Pokemon song
	];
    
    var PR = [
		1,2,3,51,52 //Prodigy
	];

	var FF = [6,7,41,42,81]; //foo fighters

	var MS = [10,11,85,104]; //Muford & Son

	var strokeWidthColored = 15,	//top 3 artiesten
		strokeWidthRed = 15;		//Interesante verhalen?
		
	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Read in the data /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	
	d3.dsv(";", "data/data3.csv", function(d) {
	  return {
		festival: d.festival,// 
		artiest: d.artiest,
		naam: d.naam,
		jaar: d.jaar, 
		ervaring:d.ervaring,
		x:d.x,
		y:d.y,
		aantalStemmen:d.aantalStemmen,
	  };
}).then(function(data) {
  console.log(data);




		
		///////////////////////////////////////////////////////////////////////////
		//////////////////////////// Draw the circles /////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		//Wrapper for each festivals -> to do
	  	var festivalWrapper = svg.append("g")
	      .attr("class", "festival-wrapper");
		  
		//Create a group per festival
		var festival = festivalWrapper.selectAll(".festival-group")
		  	.data(data)
		  	.enter().append("g")
		  	.attr("class", "festival-group")
		  	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		  	.on("mouseover", function(d) { 
		  
            document.getElementById('ervaringwrap').style.opacity=0.9;
            document.getElementById('artiest').innerHTML = d.artiest
            document.getElementById('festival').innerHTML = d.festival
            document.getElementById('jaar').innerHTML = d.jaar
            document.getElementById('naam').innerHTML = d.naam
            document.getElementById('ervaring').innerHTML = d.ervaring
                
                //smooth effects
                tooltipBackground
		      		.transition().duration(100)
		      	tooltipWrapper
					.transition().duration(200)
		        	.style("opacity", 1);
				//console.log(d.festival, d.artiest, d.naam, d.jaar, d.ervaring); 

		  		

				//Find the largest title
				var maxSize = Math.max(document.getElementById("tooltipFestival").getComputedTextLength(), 
		      		document.getElementById("tooltipArtiest").getComputedTextLength(), 
		      		document.getElementById("tooltipNaam").getComputedTextLength(),
		      		document.getElementById("tooltipErvaring").getComputedTextLength());
		      	
		      	getElementById('ervaringwrap').style.height='maxSize';
                
                
		  	})
		  	.on("mouseout", function(d) {
		  		//Hide the tooltip
				
				            
            document.getElementById('ervaringwrap').style.opacity=0;

                
                tooltipWrapper
					.transition().duration(200)
					.style("opacity", 0);
		  	});

	//The colored background for some songs (since I can't do an outside stroke)
		festival
			.filter(function(d) { return d.artiest === "Foo Fighters" || PR.indexOf(d.nummer) > -1 || MS.indexOf(d.nummer) > -1 || interestingSongs.indexOf(d.nummer) > -1; })
			.append("circle")
			.attr("class", "stemmen")
	      	.attr("r", function(d) { 
	      		if(d.artiest === "Foo Fighters" || PR.indexOf(d.nummer) > -1 || MS.indexOf(d.nummer) > -1) {
					return strokeWidthColored;
				} else if(interestingSongs.indexOf(d.nummer) > -1) {
					return strokeWidthRed;
				} else {
					return -1; //check for error
				}//else
	      	})
		  	.style("fill", function(d) {
			  	if(d.artiest === "Foo Fighters") {
				  	return "#FF2E88";
			  	} else if (interestingSongs.indexOf(d.nummer) > -1) {
				  	return "#CB272E";
			  	} else if (PR.indexOf(d.nummer) > -1) {
				  	return "#f1aa11";
			  	} else if (MS.indexOf(d.nummer) > -1) {
				  	return "#C287FF";
			  	} else {
				  	return "none";
			  	}//else
		  	});

		//draw circle for each festivalgroup
		festival.append("circle")
			.attr("class", "festival")
	      	.attr("r", 10)
		  	.style("fill", function(d) { 
			  	if(d.type === "decade") {
				  	return "none";
			  	}  else {
					return colorScale(d.aantalStemmen);
				}//else 
		  	});
			
		
		


		///////////////////////////////////////////////////////////////////////////
		////////////////////////////// Add Tooltip ////////////////////////////////
		///////////////////////////////////////////////////////////////////////////


        
        
		var tooltipWrapper = svg.append("g")
		  .attr("class", "tooltip-wrapper") 
		
		  .style("opacity", 0);

		var tooltipBackground = tooltipWrapper.append("rect")
			.attr("class", "tooltip-background")
			.attr("y", 380)
			.attr("width", 0)
			.attr("height", 100);

		var tooltipArtiest = tooltipWrapper.append("text")
		  .attr("class", "tooltip-artiest")
		  .attr("id", "tooltipArtiest")
			.attr("x",880)
		  .attr("y", 410)
		  .text("");

		var tooltipFestival = tooltipWrapper.append("text")
		  .attr("class", "tooltip-festival")
		  .attr("id", "tooltipFestival")
			.attr("x",880) 
			.attr("y", 430)
		  .text("");

		var tooltipNaam = tooltipWrapper.append("text")
		  .attr("class", "tooltip-naam")
		  .attr("id", "tooltipNaam")
			.attr("x",880)
		  .attr("y", 460)
		  .text("");
		
		var tooltipErvaring = tooltipWrapper.append("text")
		  .attr("class", "tooltip-ervaring")
		  .attr("id", "tooltipErvaring")
			.attr("x",880)
			.attr("y", 480)
			.attr("width", 100)
		  	.text("");

		
			
		

		
	///////////////////////////////////////////////////////////////////////////
		///////////////////////////// Add color legend ////////////////////////////
		///////////////////////////////////////////////////////////////////////////


		var colorLegend = svg.append("g")
			.attr("class", "color-legend")
			.attr("transform", "translate(" + 370 + "," + +510 + ")");

		colorLegend.append("text")
			.attr("class", "legend-title")
			.attr("x", -8)
			.attr("y", -30)
			.text("Aantal stemmen per artiest:");
		
		

		colorLegend.selectAll(".festival-color")
			.data(colorScale.range())
			.enter().append("circle")
			.attr("class", "festival-color")
			.attr("cx", function(d,i) { return 2 * i * rScale(100)*1.2; })
			.attr("r", rScale(100))
			.style("fill", function(d) { return d; });	
		
		
		//Add text below
		
		
		colorLegend.append("text")
			.attr("class", "festival-legend-value")
			.attr("x", 0)
			.attr("y", 30)
			.text("1");
		colorLegend.append("text")
			.attr("class", "festival-legend-value")
			.attr("x", 24)
			.attr("y", 30)
			.text("2");
		colorLegend.append("text")
			.attr("class", "festival-legend-value")
			.attr("x", 48)
			.attr("y", 30)
			.text("3");
		colorLegend.append("text")
			.attr("class", "festival-legend-value")
			.attr("x", 72)
			.attr("y", 30)
			.text("4");
		colorLegend.append("text")
			.attr("class", "festival-legend-value")
			.attr("x", 96)
			.attr("y", 30)
			.text("5");
		
        
		

	
		
	});//d3.csv

}//else

