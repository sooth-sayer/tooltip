import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import positions from 'positions';
import Trigger from 'rc-trigger';
import { placements } from './placements';
import Content from './Content';

const placementsMap = {
  tc: 'top center',
  bc: 'bottom center',
  cl: 'center right',
  cr: 'center left',
  tl: 'top left',
  tr: 'top right',
  bl: 'bottom left',
  br: 'bottom right',
};

class Tooltip extends Component {
  static propTypes = {
    trigger: PropTypes.any,
    children: PropTypes.any,
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    placement: PropTypes.string,
    transitionName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    animation: PropTypes.any,
    onVisibleChange: PropTypes.func,
    afterVisibleChange: PropTypes.func,
    overlay: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    overlayStyle: PropTypes.object,
    overlayClassName: PropTypes.string,
    prefixCls: PropTypes.string,
    mouseEnterDelay: PropTypes.number,
    mouseLeaveDelay: PropTypes.number,
    getTooltipContainer: PropTypes.func,
    destroyTooltipOnHide: PropTypes.bool,
    align: PropTypes.object,
    arrowContent: PropTypes.any,
    id: PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'rc-tooltip',
    mouseEnterDelay: 0,
    destroyTooltipOnHide: false,
    mouseLeaveDelay: 0.1,
    align: {},
    placement: 'right',
    trigger: ['hover'],
    arrowContent: null,
  };

  saveArrow = (node) => {
    this.arrow = node;
  }

  saveTrigger = (node) => {
    this.trigger = node;
  }

  getPopupElement = () => {
    const { arrowContent, overlay, prefixCls, id } = this.props;
    return ([
      <div ref={this.saveArrow} className={`${prefixCls}-arrow`} key="arrow">
        {arrowContent}
      </div>,
      <Content
        key="content"
        trigger={this.trigger}
        prefixCls={prefixCls}
        id={id}
        overlay={overlay}
      />,
    ]);
  }

  getPopupDomNode() {
    return this.trigger.getPopupDomNode();
  }

  onPopupAlign = (popupNode, align) => {
    const { onPopupAlign } = this.props;

    if (align.overflow.adjustX !== false || align.overflow.adjustY !== false) {
      const targetNode = findDOMNode(this);

      const position = positions(this.arrow, placementsMap[align.points[0]], targetNode, placementsMap[align.points[1]]);

      if (align.points[0] === 'tc' || align.points[0] === 'bc') {
        arrowNode.style.top = '';
        arrowNode.style.left = `${position.left}px`;
      } else {
        arrowNode.style.top = `${position.top}px`;
        arrowNode.style.left = '';
      }
    }

    if (onPopupAlign) {
      onPopupAlign(popupNode, align);
    }
  }

  render() {
    const {
      overlayClassName, trigger,
      mouseEnterDelay, mouseLeaveDelay,
      overlayStyle, prefixCls,
      children, onVisibleChange, afterVisibleChange,
      transitionName, animation,
      placement, align,
      destroyTooltipOnHide,
      defaultVisible, getTooltipContainer,
      ...restProps,
    } = this.props;
    const extraProps = { ...restProps };
    if ('visible' in this.props) {
      extraProps.popupVisible = this.props.visible;
    }
    return (
      <Trigger
        popupClassName={overlayClassName}
        ref={this.saveTrigger}
        prefixCls={prefixCls}
        popup={this.getPopupElement}
        action={trigger}
        builtinPlacements={placements}
        popupPlacement={placement}
        popupAlign={align}
        getPopupContainer={getTooltipContainer}
        onPopupVisibleChange={onVisibleChange}
        afterPopupVisibleChange={afterVisibleChange}
        popupTransitionName={transitionName}
        popupAnimation={animation}
        defaultPopupVisible={defaultVisible}
        destroyPopupOnHide={destroyTooltipOnHide}
        mouseLeaveDelay={mouseLeaveDelay}
        popupStyle={overlayStyle}
        mouseEnterDelay={mouseEnterDelay}
        {...extraProps}
        onPopupAlign={this.onPopupAlign}
      >
        {children}
      </Trigger>
    );
  }
}

export default Tooltip;
