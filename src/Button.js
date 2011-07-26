Button = new Class({
	Implements: [Options,Events],
	options: {
		'css_class': 'generic-button',
		'element': 'button',
		'value': 'button',
		'holdTime': 800,
		'verbose': false,
		'styles': {},
		'click': function(){},
		'altclick': function(){},
		'mousedown': function(){},
		'touchstart': function(){},
		'mouseup': function(){},
		'mouseover': function(){},
		'mouseleave': function(){},
		'mousehold': function(){},
		'stophold': function(){}
	},
	initialize: function(input,options){
		// Flexibility to call with just an element, or an element with options, or just options
		switch(typeOf(input)){
			case 'element':
				this.options.element = input;
				break;
			case 'object':
				this.options = input;
				break;
		}
		this.setOptions(options);
		// Determine Button Element
		if(typeOf(this.options.element) == 'element'){
			this.element=$(this.options.element);
		} else {
			this.element = new Element('button');
			this.element.addClass(this.options.css_class);
			this.element.set('html',this.options.value);
		}
		this.element.controller = this;
		this.element.setStyles(this.options.styles);
		this.element.setStyle('-webkit-tap-highlight-color','rgba(255,255,255,0)');
		//Apply Events
		this.element.removeEvents();
		this.element.addEvents({
			'click': function(event){
				try{
				event.preventDefault();
				event.stopPropagation();
				this.element.removeClass('mousedown');
				if(event.alt){
					this.options.altclick();
					this.fireEvent('altclick');
				} else {
					this.options.click(event);
				}
				this.fireEvent('click');
				this.element.blur;
				} catch(e){
					this.returnError(e);
				}
			}.bind(this),
			'touchstart': function(event){
        this.elementCoords = this.element.getCoordinates();
				this.element.addClass('mousedown');
        this.element.removeEvents('click');
				this.starthold();
        this.calculateTouchPosition(event);
				this.options.mousedown();
				this.fireEvent('mousedown');
			}.bind(this),	
			'touchmove': function(event){
        this.touchmoved = true;
        if (this.calculateTouchPosition(event)) {
        } else {
          this.element.removeClass("mousedown");
        }
			}.bind(this),		
			'touchend': function(event){
				event.stopPropagation();
				event.preventDefault();
				this.element.removeClass('mousedown');
				if ( this.touchinside && !this.touchmoved	){  
					this.options.mouseup();
					this.options.click();
					this.element.removeClass('mousedown');
				} else {
					this.element.removeClass('mousedown');
				}
			}.bind(this),
			'touchcancel': function(){
				this.element.removeClass('mousedown');
			},
			'mousedown': function(event){
				try {
				this.element.addClass('mousedown');
				this.starthold();
				this.options.mousedown();
				this.fireEvent('mousedown');
				} catch(e){
					this.returnError(e);
				}
			}.bind(this),
			'mouseup': function(event){
				try {
				event.preventDefault();
				event.stopPropagation();
				this.element.removeClass('mousedown');
				this.stophold();
				this.options.mouseup();
				this.fireEvent('mouseup');
				} catch(e){
					this.returnError(e);
				}
			}.bind(this),
			'mouseover': function(event){
				try {
				event.preventDefault();
				event.stopPropagation();
				this.element.addClass('mouseover');
				this.options.mouseover();
				this.fireEvent('mouseOver');
				} catch(e){
					this.returnError(e);
				}
			}.bind(this),
			'mouseleave': function(event){
				try {
				event.preventDefault();
				event.stopPropagation();
				this.element.removeClass('mouseover');
				this.element.removeClass('mousedown');
				this.options.mouseleave();
				this.fireEvent('mouseLeave');
				} catch(e){
					this.returnError(e);
				}
			}.bind(this)
		});
		return this.element;
	},
	calculateTouchPosition: function(event){
    this.touchinside = false;
		this.touchX = event.touches[0].pageX;
		this.touchY = event.touches[0].pageY;
		if(
			this.touchX>this.elementCoords.left && 
			this.touchX<this.elementCoords.right && 
			this.touchY>this.elementCoords.top && 
			this.touchY<this.elementCoords.bottom
		){  //Touch end is inside the buttons coords
      this.touchinside = true;
		} else {
			//Touch end is outside the buttons coords
      this.touchinside = false;
		}
		return this.touchinside;
	},
	starthold: function(){
		try {
		this.mouseIsDown = true;
		this.runHoldFunction.delay(this.options.holdTime,this);
		} catch(e){
			this.returnError(e);
		}
	},
	stophold: function(){
		try {
		this.mouseIsDown = false;
		this.element.removeClass('mousehold');
		this.options.stophold();
		} catch(e){
			this.returnError(e);
		}
	},
	runHoldFunction: function(){
		try {
		if(this.mouseIsDown){
			this.element.addClass('mousehold');
			this.options.mousehold();
			this.fireEvent('mousehold');
		}
		} catch(e){
			this.returnError(e);
		}
	},
	returnError: function(error){
		if(this.options.verbose){
			console.warn(error);
		}
	}
});