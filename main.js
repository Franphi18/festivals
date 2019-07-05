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
	var height = 620 - margin.top - margin.bottom;
		
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
			
	var vijfStemmen = [
		5, //Foofighters? hoe selecteer ik dat
		4, 
		
	];

	//David Bowie festivals
	var vierStemmen = [7,38,87,162,182,230,270,310,379,462,472,491,523,540,576,586,612,616,778,856,961,1144,1203,1632,1736,1875];

	//Prince festivals
	var PR = [13,207,254,354,404,585,640,702,721,937,1268,1365,1378,1409,1658,1761,1771];

	var strokeWidthColored = 3,	//The Beatles, Prince and David Bowie
		strokeWidthRed = 4;		//Interesting festivals
		
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
		  		
				//console.log(d.festival, d.artiest, d.naam, d.jaar, d.ervaring); 

		  		//Move the tooltip to the right location
		  		tooltipFestival.text(d.festival+ " | " + d.jaar);
		      	tooltipArtiest.text(d.artiest);
				tooltipErvaring.text(d.ervaring);
				tooltipNaam.text("Ingezonden door: " + d.naam);


				//Find the largest title
				var maxSize = Math.max(document.getElementById("tooltipFestival").getComputedTextLength(), 
		      		document.getElementById("tooltipArtiest").getComputedTextLength(), 
		      		document.getElementById("tooltipNaam").getComputedTextLength(),
		      		document.getElementById("tooltipErvaring").getComputedTextLength());
		      	
		      	tooltipBackground
		      		.transition().duration(100)
		      		.attr("x", -0.5 * maxSize*1.2)
		      		.attr("width", maxSize*1.2)
		      	tooltipWrapper
		      		.transition().duration(200)
		        	.attr("transform", "translate(" + d.x + "," + (d.y + 40) + ")")
		        	.style("opacity", 1);
		  	})
		  	.on("mouseout", function(d) {
		  		//Hide the tooltip
				
				tooltipWrapper
					.transition().duration(200)
					.style("opacity", 0);
		  	});

	//document body append div -> fixed position, class 

		//draw circle for each festivalgroup
		festival.append("circle")
			.attr("class", "festival")
	      	.attr("r", 10)
		  	.style("fill", function(d) { 
			  	if(d.type === "decade") {
				  	return "none";
			  	} else if (d.aantalStemmen === 0) {
				  	return "#e0e0e0";
			  	} else {
					return colorScale(d.aantalStemmen);
				}//else 
		  	});
			
		
		


		///////////////////////////////////////////////////////////////////////////
		////////////////////////////// Add Tooltip ////////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		var tooltipWrapper = svg.append("g")
		  .attr("class", "tooltip-wrapper")
		 .attr("transform", "translate(" + 0 + "," + 0 + ")")
		 .style("opacity", 0);

		var tooltipBackground = tooltipWrapper.append("rect")
			.attr("class", "tooltip-background")
			.attr("x", 0)
			.attr("y", -28)
			.attr("width", 0)
			.attr("height", 100);

		var tooltipArtiest = tooltipWrapper.append("text")
		  .attr("class", "tooltip-artiest")
		  .attr("id", "tooltipArtiest")
		  .attr("y", -4)
		  .text("");

		var tooltipFestival = tooltipWrapper.append("text")
		  .attr("class", "tooltip-festival")
		  .attr("id", "tooltipFestival")
		  .attr("y", 17)
		  .text("");

		var tooltipNaam = tooltipWrapper.append("text")
		  .attr("class", "tooltip-naam")
		  .attr("id", "tooltipNaam")
		  .attr("y", 40)
		  .text("");
		
		var tooltipErvaring = tooltipWrapper.append("text")
		  .attr("class", "tooltip-ervaring")
		  .attr("id", "tooltipErvaring")
		  .attr("y", 55)
		  .text("");
		
			///////////////////////////////////////////////////////////////////////////
		//////////////////////////// Add size legend //////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		
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

