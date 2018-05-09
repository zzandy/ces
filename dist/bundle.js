System.register("canvas", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var canvas;
    return {
        setters: [],
        execute: function () {
            exports_1("canvas", canvas = function () {
                var can = document.createElement('canvas');
                can.width = innerWidth;
                can.height = innerHeight;
                can.style.position = 'fixed';
                can.style.top = '0';
                can.style.left = '0';
                can.style.width = can.width + 'px';
                can.style.height = can.height + 'px';
                document.body.appendChild(can);
                return can.getContext('2d');
            });
        }
    };
});
System.register("ces", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Component, VisibleComponent, MovableComponent, Entity, EntityContainer, System, PositionComponent, RenderSystem, MoveSystem;
    return {
        setters: [],
        execute: function () {
            Component = /** @class */ (function () {
                function Component() {
                }
                return Component;
            }());
            exports_2("Component", Component);
            VisibleComponent = /** @class */ (function () {
                function VisibleComponent(color) {
                    this.color = color;
                }
                return VisibleComponent;
            }());
            exports_2("VisibleComponent", VisibleComponent);
            MovableComponent = /** @class */ (function () {
                function MovableComponent(angle, velocity) {
                    this.dx = velocity * Math.cos(angle);
                    this.dy = velocity * Math.sin(angle);
                }
                return MovableComponent;
            }());
            exports_2("MovableComponent", MovableComponent);
            Entity = /** @class */ (function () {
                function Entity(components) {
                    this.components = components;
                }
                Entity.prototype.get = function (cls) {
                    for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c instanceof cls)
                            return c;
                    }
                    return null;
                };
                return Entity;
            }());
            exports_2("Entity", Entity);
            EntityContainer = /** @class */ (function () {
                function EntityContainer(entities) {
                    this.entities = entities;
                }
                EntityContainer.prototype.all = function (c1, c2) {
                    var res = [];
                    for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                        var e = _a[_i];
                        var a = e.get(c1);
                        if (a) {
                            var b = e.get(c2);
                            if (b)
                                res.push([a, b]);
                        }
                    }
                    return res;
                };
                return EntityContainer;
            }());
            exports_2("EntityContainer", EntityContainer);
            System = /** @class */ (function () {
                function System() {
                }
                return System;
            }());
            exports_2("System", System);
            PositionComponent = /** @class */ (function () {
                function PositionComponent(x, y) {
                    this.x = x;
                    this.y = y;
                }
                return PositionComponent;
            }());
            exports_2("PositionComponent", PositionComponent);
            RenderSystem = /** @class */ (function () {
                function RenderSystem(ctx) {
                    this.ctx = ctx;
                }
                RenderSystem.prototype.trigger = function (entities) {
                    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                    for (var _i = 0, _a = entities.all(PositionComponent, VisibleComponent); _i < _a.length; _i++) {
                        var _b = _a[_i], pos = _b[0], color = _b[1].color;
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(pos.x, pos.y, 10, 10);
                    }
                };
                return RenderSystem;
            }());
            exports_2("RenderSystem", RenderSystem);
            MoveSystem = /** @class */ (function () {
                function MoveSystem(width, height) {
                    this.width = width;
                    this.height = height;
                }
                MoveSystem.prototype.trigger = function (entities) {
                    for (var _i = 0, _a = entities.all(PositionComponent, MovableComponent); _i < _a.length; _i++) {
                        var _b = _a[_i], pos = _b[0], m = _b[1];
                        if (pos.x + m.dx < 0 || pos.x + m.dx > this.width)
                            m.dx = -m.dx;
                        if (pos.y + m.dy < 0 || pos.y + m.dy > this.height)
                            m.dy = -m.dy;
                        pos.x += m.dx;
                        pos.y += m.dy;
                    }
                };
                return MoveSystem;
            }());
            exports_2("MoveSystem", MoveSystem);
        }
    };
});
System.register("loop", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Loop;
    return {
        setters: [],
        execute: function () {
            Loop = /** @class */ (function () {
                function Loop(fixedDelta, fixedUpdate, variableUpdate) {
                    this.fixedDelta = fixedDelta;
                    this.fixedUpdate = fixedUpdate;
                    this.variableUpdate = variableUpdate;
                    this.isRunning = false;
                    this.then = 0;
                    this.acc = 0;
                }
                Loop.prototype.start = function () {
                    if (this.isRunning)
                        return;
                    this.isRunning = true;
                    this.then = 0;
                    this.acc = 0;
                    var self = this;
                    var tick = function (ts) {
                        if (!self.isRunning)
                            return;
                        var delta = self.then == 0
                            ? self.fixedDelta
                            : ts - self.then;
                        self.update(delta);
                        self.then = ts;
                        requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                };
                Loop.prototype.update = function (delta) {
                    this.acc += delta;
                    while (this.acc >= this.fixedDelta) {
                        this.acc -= this.fixedDelta;
                        this.fixedUpdate(this.fixedDelta);
                    }
                    this.variableUpdate(delta);
                };
                Loop.prototype.stop = function () { this.isRunning = false; };
                return Loop;
            }());
            exports_3("Loop", Loop);
        }
    };
});
System.register("util", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function rnd(a, b) {
        if (typeof a == 'number' && b !== undefined) {
            return (a + (b - a) * Math.random()) | 0;
        }
        if (typeof a == 'number') {
            return (a * Math.random()) | 0;
        }
        if (a instanceof Array) {
            return a[(a.length * Math.random()) | 0];
        }
        return Math.random();
    }
    exports_4("rnd", rnd);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("main", ["loop", "canvas", "util", "ces"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function fixedUpdate(delta) {
        frameNo = (frameNo + 1) % frames.length;
        doRender = true;
    }
    function variableUpdate(delta) {
        if (!doRender)
            return;
        doRender = false;
        frameTimes.push(delta);
        frameTimeTimer += delta;
        if (frameTimes.length > maxFrameTimes)
            frameTimes.shift();
        if (frameTimes.length > 0 && frameTimeTimer > frameTimeInterval) {
            frameTimeTimer -= frameTimeInterval;
            console.log((1000 / (frameTimes.reduce(function (a, b) { return a + b; }) / frameTimes.length)).toFixed(2));
        }
        systems.forEach(function (s) { return s.trigger(entities); });
    }
    var loop_1, canvas_1, util_1, ces_1, frames, frameNo, doRender, ctx, color, frameTimes, maxFrameTimes, frameTimeInterval, frameTimeTimer, entities, systems, main;
    return {
        setters: [
            function (loop_1_1) {
                loop_1 = loop_1_1;
            },
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (ces_1_1) {
                ces_1 = ces_1_1;
            }
        ],
        execute: function () {
            frames = '/-\\|';
            frameNo = 0;
            doRender = false;
            ctx = canvas_1.canvas();
            color = ['red', 'green', 'blue', 'gold', 'maroon'];
            frameTimes = [];
            maxFrameTimes = 100;
            frameTimeInterval = 1000;
            frameTimeTimer = 0;
            entities = new ces_1.EntityContainer([
                new ces_1.Entity([new ces_1.PositionComponent(util_1.rnd(ctx.canvas.width), util_1.rnd(ctx.canvas.height)), new ces_1.VisibleComponent(util_1.rnd(color)), new ces_1.MovableComponent(util_1.rnd(360), 5)]),
                new ces_1.Entity([new ces_1.PositionComponent(util_1.rnd(ctx.canvas.width), util_1.rnd(ctx.canvas.height)), new ces_1.VisibleComponent(util_1.rnd(color)), new ces_1.MovableComponent(util_1.rnd(360), 5)]),
                new ces_1.Entity([new ces_1.PositionComponent(util_1.rnd(ctx.canvas.width), util_1.rnd(ctx.canvas.height)), new ces_1.VisibleComponent(util_1.rnd(color)), new ces_1.MovableComponent(util_1.rnd(360), 5)]),
                new ces_1.Entity([new ces_1.PositionComponent(util_1.rnd(ctx.canvas.width), util_1.rnd(ctx.canvas.height)), new ces_1.VisibleComponent(util_1.rnd(color)), new ces_1.MovableComponent(util_1.rnd(360), 5)]),
                new ces_1.Entity([new ces_1.PositionComponent(util_1.rnd(ctx.canvas.width), util_1.rnd(ctx.canvas.height)), new ces_1.VisibleComponent(util_1.rnd(color)), new ces_1.MovableComponent(util_1.rnd(360), 5)]),
            ]);
            systems = [new ces_1.MoveSystem(ctx.canvas.width, ctx.canvas.height), new ces_1.RenderSystem(ctx)];
            exports_5("main", main = function () {
                var loop = new loop_1.Loop(1000 / 60, fixedUpdate, variableUpdate);
                loop.start();
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map