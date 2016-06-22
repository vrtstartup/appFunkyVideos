export default function reverse() {
    return function(items) {
        return items.slice().reverse();
    };
}