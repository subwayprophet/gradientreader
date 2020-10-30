	var lineNum2StartingColorBLUERED = {
		0 : {start:'0,0,0',end:'0,0,255'},
		1 : {start:'0,0,255',end:'0,0,0'},
		2 : {start:'0,0,0',end:'255,0,0'},
		3 : {start:'255,0,0',end:'0,0,0'},
		4 : {start:'0,0,0',end:'255,80,0'},
		5 : {start:'255,80,0',end:'0,0,0'}
	}
	var lineNum2StartingColorGREENPURPLE = {
		0 : {start:'0,0,0',end:'0,200,0'},
		1 : {start:'0,200,0',end:'0,0,0'},
		2 : {start:'0,0,0',end:'255,0,255'},
		3 : {start:'255,0,255',end:'0,0,0'},
	}
	var lineNum2StartingColorORANGEBLUE = {
		0 : {start:'0,0,0',end:'255,165,0'},
		1 : {start:'255,165,0',end:'0,0,0'},
		2 : {start:'0,0,0',end:'0,0,255'},
		3 : {start:'0,0,255',end:'0,0,0'},
	}
	var lineNum2StartingColorORANGERED = {
		0 : {start:'0,0,0',end:'255,0,0'},
		1 : {start:'255,0,0',end:'0,0,0'},
		2 : {start:'0,0,0',end:'255,165,0'},
		3 : {start:'255,165,0',end:'0,0,0'},
	}

	var colorMapsByParagraph = {
		0 : lineNum2StartingColorBLUERED,
		1 : lineNum2StartingColorGREENPURPLE,
		2 : lineNum2StartingColorORANGEBLUE,
		3 : lineNum2StartingColorORANGERED
	}
	var paraChunkSize = Object.keys(colorMapsByParagraph).length;


	function reGradient() {
		// var ps = document.getElementsByTagName('p');
		var ps = document.querySelectorAll('p,span,div.body,div.content,td,li');
		let currParaNum = 0;
		for(let i=0; i<ps.length; i++) {
			var p = ps[i];
			applyGradient(p,colorMapsByParagraph[currParaNum%paraChunkSize]);
			currParaNum++;
		}
	}

	function applyGradient(el, gradientMap) {
		var lines = lineWrapDetector.getLines(el);
		
		var currLineNum = 0;
		var lineChunkSize = Object.keys(gradientMap).length;

		for(let i=0; i<lines.length; i++) {
			let chunks = lines[i];

			//get array rgb values to start line with...
			let key = currLineNum%lineChunkSize;
			let currColorObj = gradientMap[key];
			let currLineStartColorString = currColorObj.start;
			let currLineStartColorArray = currLineStartColorString.split(',');
			let startingRedVal = parseInt(currLineStartColorArray[0]);
			let startingGreenVal = parseInt(currLineStartColorArray[1]);
			let startingBlueVal = parseInt(currLineStartColorArray[2]);

			//get array of rgb values to end line with
			let currLineEndColorString = currColorObj.end;
			let currLineEndColorArray = currLineEndColorString.split(',');
			let endingRedVal = parseInt(currLineEndColorArray[0]);
			let endingGreenVal = parseInt(currLineEndColorArray[1]);
			let endingBlueVal = parseInt(currLineEndColorArray[2]);

			//get increments: (endVal-startVal)/# of chunks this line
			let chunksThisLine = chunks.length;
			let redIncrement = (endingRedVal - startingRedVal) / chunksThisLine;
			let greenIncrement = (endingGreenVal - startingGreenVal) / chunksThisLine;
			let blueIncrement = (endingBlueVal - startingBlueVal) / chunksThisLine;

			//initialize current color values to starting color values
			let currRedVal = startingRedVal;
			let currGreenVal = startingGreenVal;
			let currBlueVal = startingBlueVal;

			//set each rgb value according to position in current line gradient
			for(let j=0; j<chunks.length; j++) {
				let chunk = chunks[j];
				currRedVal = currRedVal + redIncrement;
				currGreenVal = currGreenVal + greenIncrement;
				currBlueVal = currBlueVal + blueIncrement;
				chunk.style.color = 'rgb('+currRedVal+','+currGreenVal+','+currBlueVal+')' ;
			}
			currLineNum++;
		}
	}

  chrome.runtime.onMessage.addListener(
    function(request) {
      if (request.toggle) {
        reGradient();
      };
    });
