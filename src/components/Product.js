function html(strings, ...values) {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return str;
}

export default {
    name: 'Product',
    props: {
        id: null,
        title: "",
        description: "",
        image: ""
    },
    render() {
        const template = document.createElement('div');
        template.innerHTML = html `
  <section class="card">
    <header>
      <figure>
        <div class="placeholder" style="background-image: url(http://localhost:9000/image/24/${this.props.image})"></div>
        <img
          loading="lazy"
          src="http://localhost:9000/image/500/${this.props.image}"
          alt="${this.props.description}"
          data-src="http://localhost:9000/image/500/${this.props.image}"
          width="1280"
          height="720">
      </figure>
    </header>
    <main>
      <h1>${this.props.title}</h1>
      <p>${this.props.description}</p>
      <div>
        
      </div>
    </main>
  </section>
`;
        const card = template.querySelector('.card');
        card.querySelector("img").addEventListener('load', ({ target }) => target.parentNode.querySelector('.placeholder').classList.add('fade'))
        return card;
    }
}