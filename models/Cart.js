
function Cart(oldcart) {
    this.items = oldcart.items || {};
    this.totalQty = oldcart.totalQty || 0;
    this.totalPrice = oldcart.totalPrice || 0;


    this.add = function (item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 }
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }
    this.genrateArray = function () {
        var arr = [];
        var farr = [];
        for (var id in this.items) {

            arr.push(this.items[id]);
        }
        const chunksize = 3;
        for (i = 0; i < arr.length; i = i + chunksize) {
            farr.push(arr.slice(i, i + chunksize));
        }
        //    console.log(farr);
        return farr;
    };
    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

};

module.exports = Cart;

