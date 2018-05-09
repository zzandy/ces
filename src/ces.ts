

export class Component { }
export class VisibleComponent implements Component {
    constructor(public readonly color: string) { }
}

export class MovableComponent implements Component {
    public dx: number;
    public dy: number;
    constructor(angle: number, velocity: number) {
        this.dx = velocity * Math.cos(angle);
        this.dy = velocity * Math.sin(angle);
    }
}

export class Entity {

    constructor(public readonly components: Component[]) { }
    public get<T extends Component>(cls: { new(...args: any[]): T }): T | null {
        for (const c of this.components)
            if (c instanceof cls) return c;

        return null;
    }
}

export class EntityContainer {
    constructor(private readonly entities: Entity[]) { }

    public all<T1, T2>(c1: { new(...args: any[]): T1 }, c2: { new(...args: any[]): T2 }): [T1, T2][] {

        const res: [T1, T2][] = [];

        for (const e of this.entities) {
            const a = e.get<T1>(c1);
            if (a) {
                const b = e.get<T2>(c2);
                if (b) res.push([a, b]);
            }
        }

        return res;
    }
}


export abstract class System {
    abstract trigger(entities: EntityContainer): void;
}

export class PositionComponent implements Component {
    constructor(public x: number, public y: number) {

    }
}

export class RenderSystem implements System {
    trigger(entities: EntityContainer): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (const [pos, { color }] of entities.all(PositionComponent, VisibleComponent)) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(pos.x, pos.y, 10, 10);
        }
    }

    constructor(private readonly ctx: CanvasRenderingContext2D) { }

}

export class MoveSystem implements System {
    constructor(private readonly width: number, private readonly height: number) { }

    trigger(entities: EntityContainer): void {
        for (const [pos, m] of entities.all(PositionComponent, MovableComponent)) {
            if (pos.x + m.dx < 0 || pos.x + m.dx > this.width) m.dx = -m.dx;
            if (pos.y + m.dy < 0 || pos.y + m.dy > this.height) m.dy = -m.dy;

            pos.x += m.dx;
            pos.y += m.dy;
        }
    }
}

