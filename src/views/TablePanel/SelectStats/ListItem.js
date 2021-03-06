/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectStats } from "actions";
import { Image } from "components";

const mapDispatchToProps = (dispatch) => {
  return {
    selectStats: (statsKey, item) => dispatch(selectStats(statsKey, item)),
  };
}

class ListItem extends Component {

  _onClick = () => {
    const { statsKey, item, selectStats } = this.props;
    selectStats(statsKey, item);
  }

  render() {
    const { statsKey, item } = this.props;

    let image = "add";
    if (item) {
      switch (statsKey) {
        case "adventurer":
          image = item.Id + item.rarity;
          break;
        case "wyrmprint":
        case "wyrmprint1":
        case "wyrmprint2":
          image = item.Id + "1";
          break;
        default:
          image = item.Id;
          break;
      }
    }

    return (
      <Image
        size="md"
        statsKey={statsKey}
        image={image}
        onClick={this._onClick}
      />
    );
  }
}

ListItem.propTypes = {
  statsKey: PropTypes.string.isRequired,
  item: PropTypes.object,
}

export default connect(
  null,
  mapDispatchToProps,
)(ListItem);