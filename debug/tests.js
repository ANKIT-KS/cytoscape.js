$(function(){

	$("#cytoscapeweb").cy(function(e){
		var cy = e.cy;

		
		var tests = {}; // name => setup
		function test(options){
			$("#test-type-select").append('<option value="'+ options.name +'">'+ options.displayName +'</option>');
			
			tests[options.name] = $.extend({}, {
				setup: function(){},
				teardown: function(){},
				description: ""
			}, options);
		}
		test({
			name: "none",
			displayName: "None",
			description: "Not currently running any test"
		});
		
		var currentTest;
		for(var i in tests){
			currentTest = tests[i];
			break;
		}
		
		$("#test-type-select").change(function(){
			currentTest.teardown();
			
			var name = $("#test-type-select").val();
			currentTest = tests[name];
			
			$.gritter.add({
				title: currentTest.displayName,
				text: currentTest.description
			});
			currentTest.setup();
		});
		
		test({
			name: "bypassOnClick",
			displayName: "Bypass on click",
			description: "Set nodes to red and edges to blue on click",
			setup: function(){
				cy.elements().bind("click", function(){
					this.bypass("fillColor", "red");
					
					this.bypass({
						lineColor: "blue",
						targetArrowColor: "blue",
						sourceArrowColor: "blue"
					});
				});
			},
			teardown: function(){
				cy.elements().unbind("click").removeBypass();
			}
		});
		
		test({
			name: "shapeOnClick",
			displayName: "Squares on click",
			description: "Set nodes to squares and edge arrows to squares on click",
			setup: function(){
				cy.elements().bind("click", function(){
					this.bypass({
						shape: "rectangle",
						targetArrowShape: "square",
						sourceArrowShape: "square"
					});
				});
			},
			teardown: function(){
				cy.elements().unbind("click").removeBypass();
			}
		});
		
		test({
			name: "positionOnClick",
			displayName: "Random position on click",
			description: "Put node to random position on click",
			setup: function(){
				
				var $cy = $("#cytoscapeweb");
				
				var w = $cy.width();
				var h = $cy.height();
								
				cy.nodes().bind("click", function(){
					var node = this;
					
					var p1 = node.position();
					
					var padding = 50;
					
					var p2 = {
						x: Math.random() * (w - padding) + padding,
						y: Math.random() * (h - padding) + padding
					};
					
					var delta = {
						x: p2.x - p1.x,
						y: p2.y - p1.y
					};
						
					var d = Math.sqrt( delta.x*delta.x + delta.y*delta.y );
						
					var v = {
						x: delta.x/d,
						y: delta.y/d
					};
					
					var step = 10;
					var lastP = {
						x: p1.x,
						y: p1.y
					};
					var interval = setInterval(function(){
						
						d -= step;
						
						if(d < 0){
							step = step + d;
						}
						
						lastP = {
							x: lastP.x + step*v.x,
							y: lastP.y + step*v.y
						};
						node.position(lastP);
						
						if( d <= 0 ){
							clearInterval(interval);
						}
					}, 10);
				});
			},
			teardown: function(){
				cy.elements().unbind("click");
			}
		});
		
		
		test({
			name: "labelOnClick",
			displayName: "Label on click",
			description: "Change label on click",
			setup: function(){
				cy.elements().bind("click", function(){
					this.bypass({
						labelText: "clicked"
					});
				});
			},
			teardown: function(){
				cy.elements().unbind("click").removeBypass();
			}
		});
		
		test({
			name: "hideOnClick",
			displayName: "Hide on click",
			description: "Hide nodes and edges when clicked",
			setup: function(){
				cy.elements().bind("click", function(){
					this.hide();
				});
			},
			teardown: function(){
				cy.elements().unbind("click").removeBypass();
			}
		});
		
		test({
			name: "fancyStyle",
			displayName: "Set a fancy visual style",
			description: "Change the visual style and make sure it takes effect",
			setup: function(){
				
				var edgeColor = {
					defaultValue: "blue",
					continuousMapper: {
						attr: {
							name: "weight"
						},
						mapped: {
							min: "blue",
							max: "red"
						}
					}
				};
				
				cy.style({
					selectors: {
						"node": {
							shape: "rectangle",
							fillColor: "lightblue",
							borderColor: "black",
							borderWidth: 1,
							width: {
								defaultValue: 10,
								continuousMapper: {
									attr: {
										name: "weight",
										min: 20,
										max: 100
									},
									mapped: {
										min: 20,
										max: 100
									}
								}
							},
							height: 20,
							labelFontWeight: "normal",
							labelFontSize: "0.75em",
							labelText: {
								defaultValue: "",
								customMapper: function(data){
									return Math.round( data.weight );
								}
							},
							labelValign: "middle",
							labelHalign: "middle"
						},
						"node:selected": {
							borderWidth: 3
						},
						"edge": {
							lineColor: edgeColor,
							targetArrowShape: "triangle",
							targetArrowColor: edgeColor
						},
						"edge:selected": {
							width: 3
						}
					}
				});
			},
			teardown: function(){
				cy.style(window.options.style);
			}
		});
	});

});