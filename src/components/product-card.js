import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getCartRessource, setCartRessource } from '../idbHelper';

export class ProductCard extends Base {
    constructor() {
        super();

        this.product = {};

        this.loaded = false;
    }
    static get properties() {
        return {
            product: { type: Object },
            loaded: { type: Boolean, state: true },
        };
    }

    firstUpdated() {
        const image = this.querySelector('img');
        image.addEventListener('load', () => {
            this.loaded = true;
        });
    }


    async AddProductToCart() {
        let dataCart = {};
        let selectedProduct = this.product;
        await getCartRessource().then((elm => {
            dataCart = elm;
        }));
        let productsCartIds = [];
        if (dataCart) {
            dataCart.products.forEach(elm => productsCartIds.push(elm.product.id));
            if (!productsCartIds.includes(selectedProduct.id)) {
                dataCart.products.push({
                    product: selectedProduct,
                    total: 1
                });
                dataCart.total += selectedProduct.price;
            } else {
                let prd = dataCart.products.find(elm => elm.product.id == selectedProduct.id);
                let index = dataCart.products.indexOf(prd);
                dataCart.products.splice(index, 1);
                prd.total++;
                dataCart.products.push(prd);
                dataCart.total += prd.product.price;
            }
        } else {
            dataCart = {
                products: [{
                    product: selectedProduct,
                    total: 1
                }],

                total: Number(selectedProduct.price)
            }
        }
        await setCartRessource(dataCart);
    };

    render() {
        return html `
      <a href="/product/${this.product.id}" class="card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
            <img
              loading="lazy"
              src="http://localhost:9000/image/500/${this.product.image}"
              alt="${this.product.description}"
              data-src="http://localhost:9000/image/500/${this.product.image}"
              width="1280"
              height="720">
          </figure>
        </header>
        <main>
          <h1>${this.product.title}</h1>
          <p>${this.product.description}</p>
        </main>
      </a>
      <a>

      </a>
      <div>
        <button class="addToCart"  @click="${this.AddProductToCart}">  buy </button>
      </div>
    `;
    };
}
customElements.define('product-card', ProductCard);