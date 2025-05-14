/**
 * AccessibilityProps utility for Reactive chmlsh
 * Provides helper functions for working with accessibility props
 */

/**
 * Convert React Native accessibility props to ARIA attributes
 * @param {Object} props - Accessibility props
 * @returns {Object} ARIA attributes
 */
export function getAccessibilityProps(props) {
  const {
    accessible,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    accessibilityState,
    accessibilityValue,
    importantForAccessibility,
    accessibilityLiveRegion,
  } = props;

  const accessibilityProps = {};

  if (accessible) {
    // Map React Native accessibility props to ARIA attributes
    if (accessibilityRole) {
      accessibilityProps.role = mapRoleToARIA(accessibilityRole);
    }

    if (accessibilityLabel) {
      accessibilityProps['aria-label'] = accessibilityLabel;
    }

    if (accessibilityHint) {
      accessibilityProps['aria-describedby'] = accessibilityHint;
    }

    if (accessibilityState) {
      if (accessibilityState.disabled) {
        accessibilityProps['aria-disabled'] = accessibilityState.disabled;
      }
      if (accessibilityState.selected) {
        accessibilityProps['aria-selected'] = accessibilityState.selected;
      }
      if (accessibilityState.checked) {
        accessibilityProps['aria-checked'] = accessibilityState.checked;
      }
      if (accessibilityState.busy) {
        accessibilityProps['aria-busy'] = accessibilityState.busy;
      }
      if (accessibilityState.expanded) {
        accessibilityProps['aria-expanded'] = accessibilityState.expanded;
      }
    }

    if (accessibilityValue) {
      if (accessibilityValue.min) {
        accessibilityProps['aria-valuemin'] = accessibilityValue.min;
      }
      if (accessibilityValue.max) {
        accessibilityProps['aria-valuemax'] = accessibilityValue.max;
      }
      if (accessibilityValue.now) {
        accessibilityProps['aria-valuenow'] = accessibilityValue.now;
      }
      if (accessibilityValue.text) {
        accessibilityProps['aria-valuetext'] = accessibilityValue.text;
      }
    }

    if (importantForAccessibility) {
      switch (importantForAccessibility) {
        case 'no-hide-descendants':
          accessibilityProps['aria-hidden'] = true;
          break;
        case 'no':
          accessibilityProps.role = 'presentation';
          break;
        default:
          break;
      }
    }

    if (accessibilityLiveRegion) {
      accessibilityProps['aria-live'] = accessibilityLiveRegion === 'assertive'
        ? 'assertive'
        : 'polite';
    }
  }

  return accessibilityProps;
}

/**
 * Map React Native accessibility roles to ARIA roles
 * @param {string} role - React Native role
 * @returns {string} ARIA role
 */
function mapRoleToARIA(role) {
  switch (role) {
    case 'adjustable':
      return 'slider';
    case 'alert':
      return 'alert';
    case 'button':
      return 'button';
    case 'checkbox':
      return 'checkbox';
    case 'combobox':
      return 'combobox';
    case 'header':
      return 'heading';
    case 'image':
      return 'img';
    case 'imagebutton':
      return 'button';
    case 'keyboardkey':
      return 'key';
    case 'link':
      return 'link';
    case 'menu':
      return 'menu';
    case 'menubar':
      return 'menubar';
    case 'menuitem':
      return 'menuitem';
    case 'none':
      return 'presentation';
    case 'progressbar':
      return 'progressbar';
    case 'radio':
      return 'radio';
    case 'radiogroup':
      return 'radiogroup';
    case 'scrollbar':
      return 'scrollbar';
    case 'search':
      return 'search';
    case 'spinbutton':
      return 'spinbutton';
    case 'summary':
      return 'region';
    case 'switch':
      return 'switch';
    case 'tab':
      return 'tab';
    case 'tablist':
      return 'tablist';
    case 'text':
      return 'textbox';
    case 'timer':
      return 'timer';
    case 'togglebutton':
      return 'button';
    case 'toolbar':
      return 'toolbar';
    default:
      return role;
  }
}

/**
 * Create a unique ID for accessibility elements
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export function createAccessibilityId(prefix = 'chmlsh-a11y') {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a relationship between two elements for accessibility
 * @param {string} type - Type of relationship ('label', 'description', 'controls', 'owns')
 * @param {string} targetId - ID of the target element
 * @returns {Object} ARIA attributes
 */
export function createAccessibilityRelationship(type, targetId) {
  switch (type) {
    case 'label':
      return { 'aria-labelledby': targetId };
    case 'description':
      return { 'aria-describedby': targetId };
    case 'controls':
      return { 'aria-controls': targetId };
    case 'owns':
      return { 'aria-owns': targetId };
    default:
      return {};
  }
}
