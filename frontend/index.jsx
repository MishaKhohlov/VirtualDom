'use strict';

/** @jsx h */

function start() {
  let cont = document.getElementById('virtual-dom');

  function h(type, props, ...children) {
    return {type, props: props || {}, children}
  }

  const startNode = (
    <div>
      <ul className='list' style='list-style: none'>
        <li>item 1</li>
        <li>item 2</li>
      </ul>
      <input type='checkbox' checked={true}/>
    </div>
  );

  const newNode = (
    <div>
      <ul className='new-list__class' style='list-style: inherit'>
        <li>item 1</li>
        <li className="Hello">Hello</li>
      </ul>
      <input type='checkbox' checked={false}/>
    </div>
  );

  /* create element, props  */

  function createElement(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node)
    }

    const $el = document.createElement(node.type);

    setProps($el, node.props);

    node.children.map(createElement).forEach(childEl => $el.appendChild(childEl));
    return $el
  }

  function setProps($el, props) {
    Object.keys(props).forEach(name => {
      serProp($el, name, props[name])
    });
  }

  function serProp($el, name, prop) {
    if (name === 'className') {
      $el[name] = prop
    } else if (typeof prop === 'boolean') {
      $el.setAttribute(name, String(prop));
      $el[name] = prop;
    } else {
      $el.setAttribute(name, prop)
    }
  }

  /* change function, update Element, props, remove Props */

  function updateElement($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
      $parent.appendChild(
        createElement(newNode)
      )
    } else if (!newNode) {
      $parent.removeChild(
        $parent.childNodes[index]
      )
    } else if (changed(newNode, oldNode)) {
      $parent.replaceChild(
        createElement(newNode),
        $parent.childNodes[index]
      )
    } else if (newNode.type) {
      updateProps(
        $parent.childNodes[index],
        newNode.props,
        oldNode.props
      );

      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(
          $parent.childNodes[index],
          newNode.children[i],
          oldNode.children[i],
          i
        )
      }
    }
  }

  function changed(node1, node2) {
    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type
  }

  function updateProps($el, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);

    Object.keys(props).forEach(name => {
      updateProp($el, name, newProps[name], oldProps[name])
    })
  }

  function updateProp($el, name, newVal, oldVal) {
    if(!newVal) {
      remopveProp($el, name, oldVal)
    } else if(!oldVal || newVal !== oldVal) {
      setProp($el, name, newVal)
    }
  }

  function setProp($el, name, value) {
    if(isCustomProps(name)) {
      return;
    } else if(name === 'className'){
      $el.setAttribute('class', value);
    } else if(typeof value === 'boolean') {
      $el.setAttribute(name, String(value));
      $el[name] = value;
    } else {
      $el.setAttribute(name, value);
    }
  }

  function remopveProp($el, name, value) {
    if(isCustomProps(name)) {
      return;
    } else if(name === 'className'){
      $el.removeAttribute('class');
    } else if(typeof value === 'boolean') {
      $el.removeAttribute(name);
      $el[name] = false;
    } else {
      $el.removeAttribute(name);
    }
  }

  function isCustomProps(name) {
    return false;
  }

  updateElement(cont, startNode);

  $('.btn-reload').click(() => updateElement(cont, newNode, startNode))

}

$(document).ready(start);

/*
 let ref = {
 type: 'ul',
 props: {'class': 'list'},
 children: [
 {type: 'li', props: {}, children: ['item1']},
 {type: 'li', props: {}, children: ['item2']},
 ]
 };
 */
