export default function seconds() {
    return function(input) {
        if (input === null) {
            return null;
        }
        if (!input) {
            return undefined;
        }

       console.log('FILTER input', input);

        return input;

    };
}
