import * as $ from 'jquery'
function createAnalytics() :object {
    let counter: number = 0;
    let isDestroy: boolean = false;

    const listener = (): number => counter++;

    $(document).on('click', listener);

    return {
        destroy () {
            $(document).off('click', listener);
            isDestroy = true;
        },
        getClicks () {
            if (isDestroy) {
                return 'Analytics is destroyed'
            }
            return counter
        }
    }
}

window['analytics'] = createAnalytics();