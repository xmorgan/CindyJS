var createCindy = (function() {
            "use strict";

            var debugStartup = false;

            var waitCount = -1;

            var toStart = [];

            // waitFor returns a callback which will decrement the waitCount
            function waitFor(name) {
                if (waitCount === 0) {
                    console.error("Waiting for " + name + " after we finished waiting.");
                    return function() {};
                }
                if (waitCount < 0)
                    waitCount = 0;
                if (debugStartup)
                    console.log("Start waiting for " + name);
                ++waitCount;
                return function() {
                    if (debugStartup)
                        console.log("Done waiting for " + name);
                    --waitCount;
                    if (waitCount < 0) {
                        console.error("Wait count mismatch: " + name);
                    }
                    if (waitCount === 0) {
                        var i = 0,
                            n = toStart.length;
                        if (debugStartup)
                            console.log("Done waiting, starting " + n + " instances:");
                        while (i < n)
                            toStart[i++].startup();
                    }
                };
            }

            if (typeof document !== "undefined" && typeof window !== "undefined" &&
                typeof document.addEventListener !== "undefined" &&
                (typeof window.cindyDontWait === "undefined" ||
                    window.cindyDontWait !== true)) {
                document.addEventListener("DOMContentLoaded", waitFor("DOMContentLoaded"));
            }

            if (typeof window !== "undefined" &&
                typeof window.__gwt_activeModules !== "undefined") {
                Object.keys(window.__gwt_activeModules).forEach(function(key) {
                    var m = window.__gwt_activeModules[key];
                    m.cindyDoneWaiting = waitFor(m.moduleName);
                });
                var oldStatsEvent = window.__gwtStatsEvent;
                window.__gwtStatsEvent = function(evt) {
                    if (evt.evtGroup === "moduleStartup" && evt.type === "end") {
                        window.__gwt_activeModules[evt.moduleName].cindyDoneWaiting();
                    }
                };
            }

            function createCindy(data) {
                var instance = createCindy.newInstance(data);
                if (waitCount <= 0) instance.startup();
                else if (data.autostart !== false) toStart.push(instance);
                if (typeof window !== "undefined") {
                    window.evokeCS = instance.evokeCS;
                    window.csplay = instance.play;
                    window.cspause = instance.pause;
                    window.csstop = instance.stop;
                }
                return instance;
            }

            createCindy.waitFor = waitFor;
            createCindy._pluginRegistry = {};
            createCindy.instances = [];
            createCindy.registerPlugin = function(apiVersion, pluginName, initCallback) {
                if (apiVersion !== 1) {
                    console.error("Plugin API version " + apiVersion + " not supported");
                    return false;
                }
                createCindy._pluginRegistry[pluginName] = initCallback;
            };
            createCindy.newInstance = function(instanceInvocationArguments) {
