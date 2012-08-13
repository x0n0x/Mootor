

// TODO: rewrite & comment

var Panel = function(){},

/**
 * Translate element
 */
_translate = function (options) {
        
    options.duration = options.duration ? 
                      options.duration : 0;
                      
    options.callback = options.callback ? 
                       options.callback : function () {};
                       
    options.y = options.y ?
                options.y : 0;
    
    options.x = options.x ?
                options.x : 0;
    
    $(options.el).translateFx(
        {y: options.y,x: options.x},
        {transitionDuration: options.duration, callback: options.callback}
    );
    
};

$.extend({
    
    /**
     * Load panel
     */
    // TODO: rewrite & comment
    load: function(navInstance) {
        
            var panel,
                callback,
                back,
                positionX,
                hiddenContent,
                i;
                   
            // Current panel
            panel = navInstance.items[navInstance.current];
            // Back panel
            back = navInstance.items[navInstance._config.back];
            // Hidden content while transitioning
            hiddenContent = $(panel.el).find("." + navInstance._config.hiddenClassName);
                        
            for (i = hiddenContent.length; i--;) {
                $(hiddenContent[i]).el.style.opacity = "0";
            }
            
            $(panel.el).show();
           
            callback = function () {
                $(back.el).hide();
                
                navInstance._config.isMoving = false;                

                for (i = hiddenContent.length; i--;) {
                    $(hiddenContent[i]).el.style.opacity = "1";
                }
                
                panel.x = 0;
                navInstance._config.x = 0;
                _translate({el: navInstance.el, x: 0}, navInstance);
                _translate({el: panel.el, x: 0}, navInstance);
            };

            // Initial position for translate
            positionX = navInstance._config.width + navInstance._config.margin;

            if (navInstance.current !== 0) {

                navInstance._config.anchorBack.show()

                if (navInstance._config.back === 0) {
                    _translate({el: panel.el, x: positionX}, navInstance);
                    panel.x = positionX;
                    positionX = -positionX;

                } else {
                                    
                    if (navInstance._config.direction === 0 ) {

                        _translate({el: navInstance.el, x: 0}, navInstance);
                        _translate({el: panel.el, x: positionX}, navInstance);
                        panel.x = positionX;
                        _translate({el: back.el, x: 0}, navInstance);
                        positionX = -positionX;
                    
                    } else {

                        positionX = 0;
                        panel.x = 0;
    
                    }
                    
                }
            } else if (navInstance._config.back !== 0) {
           
                _translate({el: navInstance.el, x: -positionX}, navInstance);
                _translate({el: panel.el, x: 0});
                panel.x = 0;
                _translate({el: back.el, x: positionX}, navInstance);
                positionX = 0;                
                navInstance._config.anchorBack.hide();
            }
            
            window.setTimeout(function () {
                _translate({
                    el: navInstance.el,
                    duration: .25,
                    x: positionX,
                    callback: callback
                }, navInstance);
            }, 1);
                        
            if (typeof panel.onLoadContent === "function") {
                            
                panel.onLoadContent();
                panel.onLoadContentCallback = function() {
                    if (panel.navigationItems.length === 0) {
                        Item.initNavigationItems(panel, navInstance);
                    }
                    panel.height = panel.el.offsetHeight;                    
                    if (navInstance._config.height > panel.height) {
                        panel.height = navInstance._config.height;
                    }
                }
            }
            
            if (typeof panel.onLoadContent === "function") {
                panel.onLoad();
            }

        },
    
    /**
     * Initialize CSS Styles
     */
    // TODO: rewrite & comment
    initStyles: function(self) {
            var i = 0,
                item = {};
                
            for (i = self._config.count; i--;) {
    
                item = self.items[i];
                
                // Translate all but first panel off of the screen
                if (i > 0) {
                    _translate({
                        el: item.el, 
                        x:  -((self._config.width + self._config.margin) * 4),
                        y:0
                    }, self);
                } else {
                    _translate({
                        el: item.el,
                        x:0
                    }, self);
                }
                
                // Fill screen vertically
                item.height = item.el.offsetHeight;                
                if (self._config.height > item.height) {
                    item.height = self._config.height;
                }
            }
        },
    
    /**
     * Check move
     */
    // TODO: rewrite & comment
    checkMove: function (gesture, self) {
            var panel = self.items[self.current],
                maxdist = panel.height - self._config.height,
                cb,
                i;
                
            if (gesture.type === "dragEnd") {

                // Bounce back
                if (self._config.y >= 0 || maxdist < -self._config.y) {
             
                    if (self._config.y > 0) {
                        self._config.y = 0;
                    } else {
                        if (self.header === undefined) {                        
                            self._config.y = -(panel.height - self._config.height);
                        } else {
                            self._config.y = -(panel.height - (self._config.height + self.header.height));                            
                            // FIXME CHECK
                            if (self._config.y === self.header.height) {
                               self._config.y -= self.header.height; 
                            }
                        }
                    }
                    for (i = panel.navigationItems.length; i--;) {
                        $(panel.navigationItems[i]).removeClass("active");
                    }
                                                          
                    _translate({
                        y: self._config.y,
                        el: panel.el,
                        duration: 0.25
                    }, self);
                }

            }

        },
    
    /**
     * Move panels
     */
    move: function(self, item, gesture) {
           self._config.y = self._config.y + (gesture.y - gesture.lastY);
            _translate({
                el: item.el,
                y: self._config.y,
                x: item.x
            }, self);                
        },

    /**
     * Set styles when Header is active
     */
    setStylesWhenHeaderActive: function(height, navInstance) {
        var i;
        for (i = navInstance._config.count; i--;) {
            navInstance.items[i].el.style.paddingTop = height/2 + "px";
        }
    }

}, Panel);