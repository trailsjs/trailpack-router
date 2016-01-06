module.exports = {
  models: {
    routes: {
      create: {
        method: 'POST',
        path: '/{model}',
        handler: 'FootprintController.create'
      },
      find: {
        method: 'GET',
        path: '/{model}/{id?}',
        handler: 'FootprintController.find'
      },
      update: {
        method: [ 'PUT', 'PATCH' ],
        path: '/{model}/{id?}',
        handler: 'FootprintController.update'
      },
      destroy: {
        method: 'DELETE',
        path: '/{model}/{id?}',
        handler: 'FootprintController.destroy'
      },
      createAssociation: {
        method: 'POST',
        path: '/{parentModel}/{parentId}/{childAttribute}',
        handler: 'FootprintController.createAssociation'
      },
      findAssociation: {
        method: 'GET',
        path: '/{parentModel}/{parentId}/{childAttribute}/{childId?}',
        handler: 'FootprintController.findAssociation'
      },
      updateAssociation: {
        method: 'PUT',
        path: '/{parentModel}/{parentId}/{childAttribute}/{childId?}',
        handler: 'FootprintController.updateAssociation'
      },
      destroyAssociation: {
        method: 'DELETE',
        path: '/{parentModel}/{parentId}/{childAttribute}/{childId?}',
        handler: 'FootprintController.destroyAssociation'
      }
    }
  }
}
