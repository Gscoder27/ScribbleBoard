export function getSvgPathFromStroke(stroke: Array<[number, number]>): string {
    if (!stroke.length) return '';

    const d = stroke.reduce(
      (acc: string[], [x0, y0]: [number, number], i: number, arr: Array<[number, number]>) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(`${x0}`, `${y0}`, `${(x0 + x1) / 2}`, `${(y0 + y1) / 2}`);
        return acc;
      },
      ['M', ...stroke[0].map(String), 'Q']
    );

    d.push('Z');
    return d.join(' ');
}

  