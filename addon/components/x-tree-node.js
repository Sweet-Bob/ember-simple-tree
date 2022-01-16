/* eslint-disable ember/no-get */
import Component from '@glimmer/component';
import { action, get, set, setProperties } from '@ember/object';

export default class TreeNodeComponent extends Component {
  get classes() {
    let classes = [];
    let { isDisabled, isSelected, id, children } = this.args.model;

    if (isDisabled) {
      classes.push('tree-disabled');
    }

    if (isSelected) {
      classes.push('tree-highlight');
    }

    if (id === this.chosenId) {
      classes.push('tree-chosen');
    }

    if (children?.length > 0) {
      classes.push('tree-children');
    }

    return classes.join(' ');
  }

  @action
  click() {
    if (this.args.onSelect && !get(this.args.model, 'isDisabled')) {
      let wasChecked = get(this.args.model, 'isChecked');

      this.args.onSelect(this.args.model);

      let isChecked = get(this.args.model, 'isChecked');
      if (isChecked !== wasChecked && this.args.recursiveCheck) {
        this.setChildCheckboxesRecursively(this.args.model, isChecked);
        this.updateCheckbox();
      }
    }
  }

  @action
  contextMenu(event) {
    if (this.args.onContextMenu) {
      event.preventDefault();
      this.args.onContextMenu(this.args.model);
    }
  }

  @action
  mouseEnter() {
    if (!get(this.args.model, 'isDisabled')) {
      set(this.args.model, 'isSelected', true);
    }


    if (this.args.onHover) {
      this.args.onHover(this.args.model);
    }
  }

  @action
  mouseLeave() {
    set(this.args.model, 'isSelected', false);

    if (this.args.onHoverOut) {
      this.args.onHoverOut(this.args.model);
    }
  }

  @action
  toggleCheck(event) {
    event.stopPropagation();

    let isChecked;
    let isIndeterminate;

    if (!get(this.args.model, 'isDisabled')) {

      if (get(this.args.model, 'isRotate')) {

        if (this.args.model?.parentTree?.isChecked) {
          switch (get(this.args.model, 'checkedNumber')) {
            // unchecked, going check
            case 0:
              set(this.args.model, 'checkedNumber', 2);
              isIndeterminate = set(this.args.model, 'isIndeterminate', false);
              isChecked       = set(this.args.model, 'isChecked', true);
              break;

            // checked, going unchecked
            default:
              set(this.args.model, 'checkedNumber', 0);
              set(this.args.model, 'isIndeterminate', false);
              isChecked = set(this.args.model, 'isChecked', false);
          }
        } else {
          switch (get(this.args.model, 'checkedNumber')) {
            // unchecked, going indeterminate
            case 0:
              set(this.args.model, 'checkedNumber', 1);
              isIndeterminate = set(this.args.model, 'isIndeterminate', true);
              isChecked       = set(this.args.model, 'isChecked', null);
              break;

            // indeterminate, going checked
            case 1:
              set(this.args.model, 'checkedNumber', 2);
              set(this.args.model, 'isIndeterminate', false);
              isChecked = set(this.args.model, 'isChecked', true);
              break;

            // checked, going unchecked
            default:
              set(this.args.model, 'checkedNumber', 0);
              set(this.args.model, 'isIndeterminate', false);
              isChecked = set(this.args.model, 'isChecked', false);
          }
        }
      } else {
        isChecked = set(this.args.model, 'isChecked', !get(this.args.model, 'isChecked'));
      }

      if (this.args.recursiveCheck) {
        this.setChildCheckboxesRecursively(this.args.model, isChecked, isIndeterminate);
        this.args.updateCheckbox();
      }

      if (this.args.onCheck) {
        this.args.onCheck(this.args.model);
      }
    }
  }

  @action
  toggleExpand(event) {
    event.stopPropagation();
    set(this.args.model, 'isExpanded', !this.args.model.isExpanded);
  }

  setChildCheckboxesRecursively(node, isChecked, isIndeterminate) {
    let children = get(node, 'children');
    if (children.length) {
      children.forEach(child => {

        if (get(this.args.model, 'isRotate')) {
          if (isChecked) {
            set(child, 'checkedNumber', 2);
            set(child, 'isIndeterminate', false);
            set(child, 'isChecked', true);
          } else if (isIndeterminate) {
            set(child, 'checkedNumber', 1);
            set(child, 'isIndeterminate', true);
            set(child, 'isChecked', null);
          } else {
            set(child, 'checkedNumber', 1);
            set(child, 'isIndeterminate', true);
            set(child, 'isChecked', null);
          }
        } else {
          setProperties(child, {
            isChecked,
            isIndeterminate: false
          });
        }

        this.setChildCheckboxesRecursively(child, isChecked);
      });
    }
  }
}
