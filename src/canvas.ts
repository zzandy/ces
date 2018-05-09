export const canvas = function ():CanvasRenderingContext2D {
    const can = document.createElement('canvas');

    can.width = innerWidth;
    can.height = innerHeight;

    can.style.position = 'fixed';
    can.style.top = '0';
    can.style.left = '0';
    can.style.width = can.width + 'px';
    can.style.height = can.height + 'px';

    document.body.appendChild(can);

    return <CanvasRenderingContext2D>can.getContext('2d');
}