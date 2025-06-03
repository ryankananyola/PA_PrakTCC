'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'service_type', {
      type: Sequelize.ENUM('Regular', 'Express', 'Premium'),
      defaultValue: 'Regular',
      allowNull: false
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'service_type');
  }
};