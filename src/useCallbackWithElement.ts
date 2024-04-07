
import { useEffect } from 'react'

type CleanupFunc = () => void
type Callback = (el: Element) => CleanupFunc | void

export function useCallbackWithElement(id: string, callback: Callback) {

    useEffect(() => {
        let tickCount = 0;
        let timer: ReturnType<typeof setTimeout> | null = null;
        let cleanup = null;

        function onTick() {
            tickCount++;

            let nextMs = 10;
            if (tickCount < 5)
                nextMs = 10;
            else if (tickCount < 10)
                nextMs = 50;
            else
                nextMs = 200;

            const found = document.querySelector('#' + id);

            if (!found) {
                // try again later
                timer = setTimeout(onTick, nextMs);
                return;
            }

            cleanup = callback(found);
            // done
        }

        onTick();

        return () => {
            clearTimeout(timer);
            if (cleanup)
                cleanup();
        }
    }, []);
};
