export class MongoFindOperatorProcessor {
  convertInputFilterToMongoFindOperator(input: any) {
    if (typeof input !== 'object') return {};
    const convertedFilter = {};
    for (const prop of Object.keys(input)) {
      let field = prop.split('_')[0];
      const operator = prop.split('_')[1];
      if (!field || !operator) continue;
      if (field === 'id') field = '_id';
      const filterValue = input[prop];
      switch (operator) {
        case 'equal':
          convertedFilter[field] = {
            $eq: filterValue,
          };
          break;

        default:
          break;
      }
    }
    return convertedFilter;
  }
}
