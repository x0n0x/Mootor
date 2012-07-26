/**
 * @summary User Interface Mootor plugin
 * @author Emilio Mariscal (emi420 [at] gmail.com)
 */
 
/** 
 * @class
 * @name $ 
 */
 
(function ($) {

    "use strict";

    var templates = {},
    
    // Private constructors
    
    /**
     * Overlay
     * @return {object} Overlay Mootor UI Overlay object
     */
    Overlay = function() {
        if (Overlay.el === undefined) {
            Overlay._makeHTML({
                type: "overlay",
                object: Overlay
            });    
        }
        this.el = Overlay.el;
        return this;
    },

    /**
     * Modal
     * @return {object} Modal Mootor UI Modal object
     */
    Modal = function() {
        if (Modal.el === undefined) {
            Overlay._makeHTML({
                type: "modal",
                object: Modal
            });    
        }
        this.el = Modal.el;
        return this;
    },
    
    /**
     * Loading
     * @return {object} Loading Mootor UI Loading object
     */
    Loading = function() {
        if (Loading.el === undefined) {
            Overlay._makeHTML({
                type: "loading",
                object: Loading
            });    
        }
        this.el = Loading.el;
        return this;
    },

    /**
     * Switch
     * @param {object} options Options
     * @config {object} el Switch container
     * @return {object} Switch Mootor UI Switch object
     */
    Switch = function(options) {
        var self = this;
                    
        this.input = options.el;                   
        $(this.input).hide();
        this._makeHTML();

        $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);                
        $(this.el).onTapEnd(function(gesture) {
            self.toggle();
        });

        if (options.value) {
            this.input.value = options.value;
        }
        
        this.toggle(this.input.value);       
        
        return this;
    },
    
     /**
     * Text
     * @param {object} options Options
     * @config {object} el Text input element
     * @return {object} Text Mootor UI Text object
     */
    Text = function(options) {
        var self = this;
                    
        this.el = this.input = options.el;                               
        if (options.value) {
            this.value = options.value;
        }

        this._makeHTML();
        
        $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);                
        $(this.el).onTapEnd(function(gesture) {
            gesture.el.focus();
        });        
        $(this.cleanbox).onTapEnd(function() {
            self.clean();
        })
                        
        return this;
    },
    
    /**
     * TextArea
     * @param {object} options Options
     * @config {object} el Textarea element
     * @return {object} TextArea Mootor UI TextArea object
     */
    TextArea = function(options) {
        var self = this;
                    
        this.el = this.input = options.el;      
        
        this._makeHTML();

        $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);                
        $(this.el).onTapEnd(function(gesture) {
            gesture.el.focus();
        });        
        
        return this;      
    },
    
    /**
     * Select
     * @param {object} options Options
     * @config {object} el Input select element
     * @return {object} Select Mootor UI Select object
     */
    Select = function(options) {
        var self = this,
            i = 0,
            items = this.items = [];
            
        this.input = options.el;        
        $(this.input).hide();
        this._makeHTML();       
        $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);
        this.y = 0;
        items = $(this.ul).find("li");
        
        for(i = 0; i < items.length; i++) {
            this.items.push({
                el: items[i], 
                mooSelectIndex: i
            });
            this.items[i].el.setAttribute("moo-select-index", i);
        }
        
        // Tap (to select)
        $(this.ul).onTapEnd(function(gesture) {
            _stopEventPropagationAndPreventDefault(gesture); 
            self.select(gesture.e.target.getAttribute("moo-select-index"));
        });
        
        // Scroll
        $(this.ul).onDragMove(function(gesture) {
            var newY;
            
            _stopEventPropagationAndPreventDefault(gesture);
            newY = self.y + (gesture.y - gesture.lastY);

            if ((newY <= 0) && (newY >= -(self.ul.offsetHeight - 160))) {
                self.y = newY;
                $(self.ul).translateFx({x: 0, y: self.y}, {});
            }
            
        });
        
        return this;
                
    },
    
    Input = function() {
    },
    
    
    /**
     * Radio
     * @param {object} options Options
     * @config {object} el Fieldset element
     * @return {object} Radio Mootor UI Radio object
     */
    Radio = function(options) {
        var self = this,
            i = 0;
                    
        this.input = options.el;                       
        $(this.input).hide();
        this._makeHTML();
        
        this.mooItems = $(this.el).find(".moo-ui-radio");        

        for (i = this.mooItems.length; i--;) {
            $(this.mooItems[i]).onTapEnd(function(gesture) {
                self.activate($(gesture.e.target));
            });
        }  
    },
    
    /**
     * Checkbox
     * @param {object} options Options
     * @config {object} el Fieldset element
     * @return {object} Checkbox Mootor UI Checkbox object
     */
    Checkbox = function(options) {
        var self = this,
            i = 0;
                    
        this.input = options.el;                       
        $(this.input).hide();
        this._makeHTML();
        
        this.mooItems = $(this.el).find(".moo-ui-checkbox");        

        for (i = this.mooItems.length; i--;) {
            $(this.mooItems[i]).onTapEnd(function(gesture) {
                self.activate($(gesture.e.target));
            });
        }    
    },
    
    
    // Private static functions
    
     /**
     * Stop event propagation and prevent default
     * @private
     * @param {object} gesture Mootor gesture
     */
    _stopEventPropagationAndPreventDefault = function(gesture) {
        gesture.e.stopPropagation();
        gesture.e.preventDefault();
    },
    
     /**
     * Mootor UI template parser
     * @private
     * @param {object} options Options
     * @config {string} template HTML template
     * @config {object} self Mootor object instance (scope)
     * @return {string} parsedHTML Parsed HTML template
     */
    _templateParse = function(options) {
        var template = options.template,
            self = options.self,
            
            elements = [],
            parsedHTML = document.createElement("div"),
            tmpElements = [],
            i = 0,
            attr = [],
            index;
        
        parsedHTML.innerHTML = template;        
        tmpElements = parsedHTML.getElementsByTagName("*");     

        for (i = tmpElements.length; i--;) {

            if (tmpElements[i].getAttribute("moo-template") !== null) {

                attr = _removeSpaces(tmpElements[i].getAttribute("moo-template"))
                      .split(":");
                      
                elements.push({
                    el: tmpElements[i],
                    key: attr[0],
                    value: attr[1]
                });
                
            }
            
            if ((index = tmpElements[i].getAttribute("moo-foreach-index")) !== null) {
                elements[i].index = index;
            }
            
        }
    
        if(_templateArrayHasForeach(elements) === true) {       
            for (i = elements.length; i--;) {
                if (elements[i].key === "foreach") {
                    _templateForEach(elements[i], self);            
                } 
            }
        } else {
            for (i = elements.length; i--;) {
                switch (elements[i].key) {
                    case "text":
                        _templateText(elements[i], self);
                        break;
                    case "html":
                        _templateHTML(elements[i], self);
                        break;
                }
            }
        }
        
        return parsedHTML.innerHTML;
        
    },
    

     /**
     * Check if any element of a Mootor template array has a "foreach" attribute
     * @private
     * @param {object} options Options
     * @config {string} template HTML template
     * @config {object} self Mootor object instance (scope)
     * @return {boolean}
     */
    _templateArrayHasForeach = function(elements) {
        var i;
        
        for (i = elements.length; i--;) {        
            if(elements[i].key === "foreach") {
                return true;
            }                
        }

        return false;
    },
    

     /**
     * Parse a "foreach" Mootor template
     * @private
     * @param {object} element Mootor template object to parse
     * @param {object} self Mootor object instance (scope)
     */
     _templateForEach = function(element, self) {
        var tag = element.value,
            collection = self.input.getElementsByTagName(tag),
            i = 0,
            tmpDiv = {},
            html = element.el.innerHTML,
            items = [],
            labels = [],
            tmpElement = document.createElement("div");
                        
        self.items = [];
        
        items = $(self.input).find(tag);
                
        if(tag === "input") {
            labels = $(self.input).find("label");
        }
                
        for (i = 0; i < items.length; i++) {
            self.items.push({
                el: items[i],
            });
            if(tag === "input") {
                self.items[self.items.length-1].label = labels[i];
            }
        }
                        
        element.el.innerHTML = "";
        
        for (i = 0; i < collection.length; i++) {
            tmpDiv = document.createElement("div")
            tmpDiv.innerHTML = html;
            tmpDiv.firstChild.setAttribute("moo-foreach-index", i);
            
            tmpDiv.innerHTML = _templateParse({
                template: tmpDiv.innerHTML,
                self: self
            });

            tmpElement.appendChild(tmpDiv);       

        }        
        
        element.el.innerHTML = tmpElement.innerHTML;

    },
    
     /**
     * Parse a "text" Mootor template
     * @private
     * @param {object} element Mootor template object to parse
     * @param {object} self Mootor object instance (scope)
     */
    _templateText = function(element, self) {
        var index = element.index,
            value = "";
            
        if(element.value.indexOf("this.") > -1) {
            value = element.value.replace("this.","");
            element.el.innerText = self.items[index][value].innerHTML;        
        }
    },


     /**
     * Parse a "html" Mootor template
     * @private
     * @param {object} element Mootor template object to parse
     * @param {object} self Mootor object instance (scope)
     */
    _templateHTML = function(element, self) {
        var index = element.index,
            value = "";
            
        if(element.value.indexOf("this.") > -1) {
            value = element.value.replace("this.","");
            element.el.innerHTML = self[value];        
        }
    },
    
     /**
     * Remove spaces from a string
     * @private
     * @param {string} string String for remove spaces
     * @return {string} string String without spaces
     */
    _removeSpaces = function(string) {
        return string.split(" ").join("");
    }
    
    
    // Object prototypes
    
    /*
     * Overlay prototype
     */
    Loading.prototype = 
    Overlay.prototype = {        
        
        show: function() {
            $(this.el).removeClass("moo-hidden");
        },
        
        hide: function() {
            $(this.el).setClass("moo-hidden");
        },
    }
    
    // Modal prototype
    Modal.prototype = {
        html: function(html) {
            this.html = html;
            this.el.innerHTML = _templateParse({
                template: this.el.innerHTML,
                self: this
            });
        }
    }
    
    $.extend(Overlay.prototype, Modal.prototype);
    
    /*
     * Select prototype
     */   
    Select.prototype = {
    
        // Make HTML
        _makeHTML: function() {
            var el = document.createElement("div"),
                options = $(this.input).find("option"),
                i = 0,
                html,
                self = this;

            this.el = el;
            this.input.parentElement.appendChild(el);
            
            // TODO 
            // Use templates
            
           $(this.el).setClass("moo-ui-select-container").setClass("moo-top");
           html = '<span class="moo-ui-select-text"></span>' +
                       '<span class="moo-ui-select-link"> &#9660;</span>' +
                       '<div class="moo-ui-select-menu"' + 
                       ' style="height:217px;display:none">' + 
                       '<ul class="moo-ui-select-list">';

            for(i = 0; i < options.length; i++) {
                html += '<li moo-select-value="' + options[i].value +
                        '">' + options[i].text + '</li>';                
            }
            html += '</ul></div>';
            $(this.el).html(html);
            
            this.ul = $(this.el).find("ul")[0];
            this.box = $(this.el).find(".moo-ui-select-menu")[0];
            this.text = $(this.el).find(".moo-ui-select-text")[0];
            
            $(this.el).onTapEnd(function(gesture) {
                $(self.box).show();
            });
        },
    
        // Select item
        select: function(index) {
            var i;
            for(i = 0; i < this.items.length; i++) {
                $(this.items[i].el).removeClass("selected");                
            }
            $(this.items[index].el).setClass("selected");
            this.value = this.items[index].el.getAttribute("moo-select-value");
            this.input.value = this.value;
            $(this.text).html(this.items[index].el.innerHTML);
            $(this.box).hide();
        }
    }
        
    /*
     * Switch prototype
     */   
    Switch.prototype = {
    
        _makeHTML: function() {
            var el;
            el = document.createElement("div");
            el.innerHTML = templates._switch;            
            this.el = el.firstChild;
            this.input.parentElement.appendChild(this.el);                        
        },
    
        /**
        * Toggle control
        *
        * @this {Switch}
        * @example var myCheck =  $("#Switch1").Switch();
        * myCheck.toggle();
        */
        toggle: function (value) {
            var el = $(this.el);

            if (value !== undefined) {
                this.value = parseInt(value);
            } else {
                if (this.value === 0) {
                    this.value = 1;
                } else {
                    this.value = 0;
                }                                
            }
            
            if (this.value === 0) {
                el.removeClass("moo-on");
                el.setClass("moo-off");                
            } else {
                el.removeClass("moo-off");
                el.setClass("moo-on");                
            }

            this.input.value = this.value;
            
            if (typeof this.onChange === "function") {
                this.onChange();
            }
        },
        
        on: function(event, callback) {
            switch (event) {
                case "change":
                    this.onChange = callback;
                    break;
            }
        }
    }
        
     /*
     * Text prototype
     */  
    Text.prototype = {
        // Make HTML
        _makeHTML: function() {
            var el,
                parent = this.el.parentElement,
                self = this;
            
            this.cleanbox = document.createElement("div");
            this.cleanbox.innerHTML = templates.text;                        
            this.input.value = this.value;

            el = document.createElement("div");
            $(el).setClass("moo-ui-text");
            el.appendChild(this.cleanbox);         
            el.appendChild(this.input);
            this.input.onkeyup = function() {
                self.value = self.input.value;
                if (typeof self.onChange === "function") {
                    self.onChange();                    
                }
            }
            parent.appendChild(el);         
        },
        
        clean: function() {
            this.input.value = "";
        },
        
        on: function(event, callback) {
            switch (event) {
                case "change":
                    this.onChange = callback;
                    break;
            }
        }
    }

     /*
     * TextArea prototype
     */  
    TextArea.prototype = {
        // Make HTML
        _makeHTML: function() {
            var el,
                parent = this.el.parentElement;
            
            el = document.createElement("div");
            $(el).setClass("moo-ui-textarea");
            el.appendChild(this.input);
            parent.appendChild(el);         
        },

    }

    /*
     * Radio prototype
     */   
    Radio.prototype = {
        // Make HTML
        _makeHTML: function() {
            var template = templates.radio,
                i;
            
            this.el = document.createElement("div");
            this.el.innerHTML = _templateParse({
                template: template,
                self: this
            });
            
            this.input.parentElement.appendChild(this.el);            
            
        },
        
        activate: function(element) {
            var i = 0,
                j = 0,
                items = {},
                item;
                                
            if($(element.el).hasClass("moo-ui-radio-icon") === false) {
                item = $(element.el.parentElement).find(".moo-ui-radio-icon")[0];
            } else {
                item = element.el;
            }            
                
            for (i = this.mooItems.length; i--;) {
                items = $(this.mooItems[i]).find(".moo-ui-radio-icon");
                for (j = items.length; j--;) {
                    if (items[j] !== item) {
                        $(items[j]).removeClass("moo-active");
                        this.items[i].el.removeAttribute("checked");
                    } else {
                        $(items[j]).setClass("moo-active");
                        this.selectedIndex = i;                                              
                    }
                } 
            }
            
            this.items[this.selectedIndex].el.setAttribute("checked", "checked");

        }
    }

    /*
     * Checkbox prototype
     */   
    Checkbox.prototype = {
        // Make HTML
        _makeHTML: function() {
            var template = templates.checkbox,
                i;
            
            this.el = document.createElement("div");
            this.el.innerHTML = _templateParse({
                template: template,
                self: this
            });
            
            this.input.parentElement.appendChild(this.el);            
            
        },
        
        activate: function(element) {
            var i = 0,
                j = 0,
                items = {},
                item,
                itemIndex,
                checked = true;
                                
            if($(element.el).hasClass("moo-ui-checkbox-icon") === false) {
                item = $(element.el.parentElement).find(".moo-ui-checkbox-icon")[0];
            } else {
                item = element.el;
            }            
                
            for (i = this.mooItems.length; i--;) {
                items = $(this.mooItems[i]).find(".moo-ui-checkbox-icon");
                for (j = items.length; j--;) {
                    if (items[j] === item) {
                        if($(items[j]).hasClass("moo-active") === false) {
                            $(items[j]).setClass("moo-active");
                            checked = true;
                        } else {
                            $(items[j]).removeClass("moo-active");
                            checked = false;
                        }
                        itemIndex = i;                                                                                              
                    }
                } 
            }
            
            if (checked === true) {
                this.items[itemIndex].el.setAttribute("checked", "checked");        
            } else {
                this.items[itemIndex].el.removeAttribute("checked", "checked");
            }

        }
    }
    
    // Static properties
    
    $.extend({
        el: undefined,
        _makeHTML: function(options) {
            var type = options.type,
                object = options.object,
                el = document.createElement("div");
            el.innerHTML = templates[type];
            object.el = el.firstChild;
            $(object.el).setClass("moo-hidden");
            $(document.body).el.appendChild(object.el);
        }
    }, Overlay);
        
        
    // Public constructors
    
    $.extend({
    
         ui: function(options) {
             options.el = this.el;
             switch (options.type) {
                 case "Switch":
                    return new Switch(options);
                    break;
                 case "Text":
                    return new Text(options);
                    break;
                 case "TextArea":
                    return new TextArea(options);
                    break;
                 case "Select":
                    return new Select(options);
                    break;
                 case "Radio":
                    return new Radio(options);
                    break;
                 case "Checkbox":
                    return new Checkbox(options);
                    break;                 
             }
         },
    });
    
    $.extend({
         ui: {
             overlay: function() {
                return new Overlay();
             },
             loading: function() {
                return new Loading();
             },
             modal: function(options) {
                return new Modal();
             }
         }
    }, $);
    

    // Templates
    
    templates = {
        radio: '<div moo-template="foreach: input"><div class="moo-ui-radio"><label><span class="moo-ui-radio-label" moo-template="text: this.label"></span><span class="moo-ui-radio-icon"> &nbsp;</span></label></div></div>',
    
        checkbox: '<div moo-template="foreach: input"><div class="moo-ui-checkbox"><label><span class="moo-ui-checkbox-label" moo-template="text: this.label"></span><span class="moo-ui-checkbox-icon"> &nbsp;</span></label></div></div>',
        
        overlay: "<div class='moo-overlay'></div>",
        
        loading: "<div class='moo-ui-loading'><div class='moo-ui-loading-block moo-loading-01'></div><div class='moo-ui-loading-block moo-loading-02'></div><div class='moo-ui-loading-block moo-loading-03'></div><div class='moo-ui-loading-block moo-loading-04'></div><div class='moo-ui-loading-block moo-loading-05'></div><div class='moo-ui-loading-block moo-loading-06'></div><div class='moo-ui-loading-block moo-loading-07'></div><div class='moo-ui-loading-block moo-loading-08'></div></div>",
        
        modal: "<div class='moo-ui-modal-container'><div class='moo-ui-modal-panel' moo-template='html: this.html'></div></div>",
        
        _switch: "<div class='moo-ui-switch'><b><span class='moo-before'></span><span class='moo-after'></span></b></div>",
        
        text: '<span class="cleanbox">&times</span>'
    }
    
}($));
