/**
* The View class handles each screen of the application. 
* A list of views is specified in the applications options
* and the files are loaded from the views/ folder.
* Each view has a viewName.js and a viewName.html file.
* The viewName.js file defines options for the view.
*
* @class View
* @module View
* @constructor
* @param {Object} options An object defining options for the current view.
* * constructor - A function that will be run after the view has loaded (optional).
* * animation - a string defining the type of animation used to show this view (one of: "slide-left", "slide-right", "none").
* @author Emilio Mariscal (emi420 [at] gmail.com)
* @author Martín Szyszlican (martinsz [at] gmail.com)
*/

(function ($, Mootor, document) {

    "use strict";
    
    var View,
    
        Event,
        App;
        
    // Dependencies
    
    Event = Mootor.Event;
    App = Mootor.App;
    
    // Event handlers
    
    App.on("init", function(self) {

        var views = App._options.views,
            viewCount = views.length,
            i,
            view;
            
        for (i = 0; i < viewCount; i++) {
            view = m.app.view(views[i]);
        }
        
        view.on("ready", function(self) {
            App.dispatch("ready");
        });
        
    });   
    
    App.on("go", function(self) {
        
        var view,
            currentView,
            app,
            stateObj,
            router = App._currentRoute,
            url = router.url;
        
        currentView = App._currentView;

        if (currentView !== undefined) {
            View.dispatch("beforeUnload", currentView);
        }

        view = App._currentView = router.view;

        if (currentView !== undefined) {
            View.dispatch("unload", currentView);
        }

        View.dispatch("beforeLoad", view);            
    
        stateObj = { view: view.id };
        
        if (currentView != view) {

            if (url !== "") {
                history.pushState(stateObj, view.id, url);
            } else {
                history.pushState(stateObj, view.id, window.location.pathname);                    
            }

        }
        View.dispatch("load", view);
        
    });
    
    // Private constructors

    View = Mootor.View = function(options) {
        this.id = options.id;
        View._init(options, this);
    };
    
    Event.extend(View, "View");
    View._dispatch = View.dispatch;
    View.dispatch = function(event, instance) {
        if (event !== "init" ) {
            View._dispatch(event + ":" + instance.id, instance);
        } else {
            View._dispatch(event, instance);
        }
    };

    // Private static methods and properties
    
    $.extend(View, {        

        /**
        * Views collection
        * @private
        */
        _collection: {},
    
        /**
        * Current active view
        * @private
        */
        _current: undefined,

        /**
        * Init View instance, load HTML, CSS and JavaScript files for the view
        *
        * @private
        * @method _init
        * @param {Array} options A list of options
        * @param {View} self View instance
        */
        _init: function(options, self) {
            View._collection[self.id] = {id: self.id, obj: self};

            View.dispatch("init", self);

            self.on("getHtml", function(view) {
                window.setTimeout(function() {
                    View._getScript(self);
                }, 1);
            });

            self.on("getScript", function() {
                View.dispatch("ready", self);
            });

            // Load Html, Css and JavaScript
            setTimeout(function() {
                View._getHtml(self);
            }, 1);
            View._getCss(self);

        },

        /**
        * Get view HTML
        *
        * @private
        * @method _getHtml
        * @param {View} self View instance
        */
        _getHtml: function(self) {
            var path,
                id = self.id;
                
            path = "views/" + id + "/" + id + ".html";
            $.get(
                path,
                function(source) {
                    View._get(self.id).html = source;
                    View.dispatch("getHtml", self);
                }
            );
        },

        /*
        * Get view script
        * @method _getScript
        * @private
        * @param {View} self View instance
        */
        _getScript: function (self) {
            var path,
                id = self.id,
                script,
                $script;
                
            path = "views/" + id + "/" + id + ".js";
            
            script = document.createElement("script");
            $script = $(script);
        
            script.src = path;
            script.type = "text/javascript";

            View._get(self.id).script = script;
            
            script.addEventListener("load", function() {
                View.dispatch("getScript", self);
            });
            
            $("head")[0].appendChild(script);
            
        },

        /*
        * Get view CSS
        * @method _getCSS
        * @private
        * @param {View} self View instance
        */
        _getCss: function (self) {
            var path,
                id = self.id,
                link,
                $link;
                
            path = "views/" + id + "/" + id + ".css";
            
            link = document.createElement("link");
            $link = $(link);
        
            link.href = path;
            link.type = "text/css";
            link.rel = "stylesheet";

            $("head").append(link);
            
            $link.one("load", {
                path: path
            }, function() {
                View._get(self.id).css = link;
                View.dispatch("getCss", self);
            });
        },
        
        _get: function(id) {
            return View._collection[id];
        },
        
        _getHtmlPath: function(self) {
            return  View._get(self.id).html;
        },

        _getCssPath: function(self) {
            return View._get(self.id).css;
        },

        _getScriptPath: function(self) {
            return View._get(self.id).script;
        }
    });
    
    // Public instance prototype
    
    $.extend(View.prototype, {
        
        /**
        * Title is the friendly name for the current view.
        * When called without parameters, returns a string containing the title. When called with parameters, sets the title.
        * 
        * @method title
        * @param {string} [title] New title for this view.
        * @return string
        */  
        title: function(title) {
            var view = View._collection[this.id];
            if (title === undefined) {
                return view.title;
            } else {
                view.title = title;
                return this;
            }
        },

        /**
        * Sets an event handler for the view
        * Possible values for event: load, beforeLoad, unload, beforeUnload, init
        * TODO: Define which parameters are passed to the callback function.
        * 
        * @method on
        * @param {string} event Defines in which event the handler will be called
        * @param {function} callback The function to be called when the event is fired.
        * @return View
        */  
        on: function(event,callback) {
            if (event !== "init") {
                View.on(event + ":" + this.id, callback);                
            } else {
                View.on(event, callback);
            }
            return this;
        },

        /**
        * Unsets event handlers for the view
        * Possible values for event: load, beforeLoad, unload, beforeUnload, init
        * 
        * @method off
        * @param {string} event Defines in which event we want to unset handlers
        * @param {function} [callback] If this parameter is specified, only that function is removed. Otherwise all callbacks for this event are removed.
        * @return View
        */  
        off: function(event,callback) {

        }

    });    
    
    $.extend(Mootor.App.prototype, {

        /**
        * Create or get a view
        *
        * @method view
        * @param {String} id The id of the view
        * @for App
        * @param {String} [options] The options object for the view
        * @return View the referenced view object
        */
        view: function(id, options) {
            var i,
                views = View._collection,
                view;
            
            if (id !== "" && id !== undefined) {
                
                if (views[id] !== undefined) {
                    view = views[id].obj;
                } else {
                    if (options === undefined) {
                        options = {};
                    }
                    options.id = id;
                    view = new View(options);
                }
            } else {
                view = App._currentView;
            }

            return view;
        },
        
    });

}(window.$, window.Mootor, window.document));