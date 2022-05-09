import { Base } from '../Base';
import { getCartRessource, setCartRessource } from '../idbHelper';
import { html } from 'lit';

export class AppCart extends Base {
    constructor() {
        super();

        this.products = [];
        this.total = 0;
    }

    async connectedCallback() {
        super.connectedCallback()

        this._refreshProducts()
    }


    async deleteProduct(id) {
        await this._deleteProduct(id)
        this._refreshProducts()
    }

    async _deleteProduct(id) {
        let dataCart = {};
        let productsCart = this.products;
        let index = productsCart.findIndex(elm => elm.product.id == id);
        let prd = productsCart[index]
        if (index !== undefined) {
            if (prd.total != 1) {
                prd.total = prd.total - 1
                productsCart.splice(index, 1)
                productsCart.push(prd)
                let total = this.total - prd.product.price
                dataCart = {
                    products: productsCart,
                    total: total
                }
                await setCartRessource(dataCart)
            } else {
                productsCart.splice(index, 1);
                await setCartRessource({
                    products: productsCart,
                    total: this.total - prd.product.price
                })
            }

        }

    }

    async _refreshProducts() {
        const dataCart = await getCartRessource()
        this.products = dataCart.products

        this.total = dataCart.total
        this.requestUpdate()
    }

    render() {
        return this.products.map(product => html `
        <a href="" class="card">
        <header>
          <figure>
            <div class="placeholder ${product.product.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9000/image/24/${product.image})"></div>
            <img
              loading="lazy"
              src="http://localhost:9000/image/500/${product.product.image}"
              data-src="http://localhost:9000/image/500/${product.product.image}"
              width="1280"
              height="720">
          </figure>
        </header>
        <main>
          <h1>${product.product.title}</h1>
          <h2> quentité : ${product.total}</h2>
        </main>
        <button class="addToCart"  @click="${() => this.deleteProduct(product.product.id)}">  retire du panier </button>
      </a>
     `);
    }
}
customElements.define('app-cart', AppCart);