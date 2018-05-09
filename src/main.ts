import { Loop } from './loop';
import { canvas } from './canvas';
import { rnd } from './util';
import { EntityContainer, RenderSystem, MoveSystem, PositionComponent, MovableComponent, Entity, VisibleComponent } from './ces';

const frames = '/-\\|';
let frameNo = 0;
let doRender = false;
const ctx = canvas();
const color = ['red', 'green', 'blue', 'gold', 'maroon'];

const frameTimes: number[] = [];
const maxFrameTimes = 100;
const frameTimeInterval = 1000;
let frameTimeTimer = 0;

let entities = new EntityContainer([
    new Entity([new PositionComponent(rnd(ctx.canvas.width), rnd(ctx.canvas.height)), new VisibleComponent(rnd(color)), new MovableComponent(rnd(360), 5)]),
    new Entity([new PositionComponent(rnd(ctx.canvas.width), rnd(ctx.canvas.height)), new VisibleComponent(rnd(color)), new MovableComponent(rnd(360), 5)]),
    new Entity([new PositionComponent(rnd(ctx.canvas.width), rnd(ctx.canvas.height)), new VisibleComponent(rnd(color)), new MovableComponent(rnd(360), 5)]),
    new Entity([new PositionComponent(rnd(ctx.canvas.width), rnd(ctx.canvas.height)), new VisibleComponent(rnd(color)), new MovableComponent(rnd(360), 5)]),
    new Entity([new PositionComponent(rnd(ctx.canvas.width), rnd(ctx.canvas.height)), new VisibleComponent(rnd(color)), new MovableComponent(rnd(360), 5)]),
]);
let systems = [new MoveSystem(ctx.canvas.width, ctx.canvas.height), new RenderSystem(ctx)];


export const main = () => {
    const loop = new Loop(1000 / 60, fixedUpdate, variableUpdate);
    loop.start();
};

function fixedUpdate(delta: number) {
    frameNo = (frameNo + 1) % frames.length;
    doRender = true;
}

function variableUpdate(delta: number) {
    if (!doRender)
        return;
    doRender = false;

    frameTimes.push(delta);
    frameTimeTimer += delta;

    if (frameTimes.length > maxFrameTimes) frameTimes.shift();

    if (frameTimes.length > 0 && frameTimeTimer > frameTimeInterval) {
        frameTimeTimer -= frameTimeInterval;
        console.log((1000 / (frameTimes.reduce((a, b) => a + b) / frameTimes.length)).toFixed(2))
    }


    systems.forEach(s => s.trigger(entities));
}