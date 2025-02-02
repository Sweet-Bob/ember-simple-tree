import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | x-tree-node', function(hooks) {
  setupRenderingTest(hooks);

  test('select event', async function(assert) {
    this.selected = false;
    this.model = {
      name: 'a',
      children: []
    };

    this.set('onSelect', () => {
      this.selected = !this.selected;
    });

    await render(hbs`<XTreeNode @model={{this.model}} @onSelect={{action this.onSelect}} />`);

    await click('.tree-toggle');

    assert.equal(this.selected, true, 'selected');

    await click('.tree-toggle');

    assert.equal(this.selected, false, 'unselected');
  });

  test('contextmenu event', async function(assert) {
    this.rightClicked = false;
    this.model = {
      name: 'a',
      children: []
    };

    this.set('onContextMenu', () => {
      this.rightClicked = true;
    });

    await render(hbs`<XTreeNode @model={{this.model}} @onContextMenu={{action this.onContextMenu}} />`);

    await triggerEvent('.tree-toggle', 'contextmenu');

    assert.equal(this.rightClicked, true, 'right click detected');
  });

  test('onHover and onHoverOut events', async function(assert) {
    this.hovering = false;
    this.model = {
      name: 'a',
      children: []
    };

    this.set('onHover', () => {
      this.hovering = true;
    });

    this.set('onHoverOut', () => {
      this.hovering = false;
    });

    await render(hbs`
      <XTreeNode
        @model={{this.model}}
        @onHover={{action this.onHover}}
        @onHoverOut={{action this.onHoverOut}}
      />
    `);

    await triggerEvent('.tree-toggle', 'mouseenter');

    assert.equal(this.hovering, true, 'hovering');

    await triggerEvent('.tree-toggle', 'mouseleave');

    assert.equal(this.hovering, false, 'hover out');
  });
});
