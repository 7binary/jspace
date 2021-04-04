import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from 'sequelize';
import { db } from '../db';
import { Cell } from './Cell';
import { PasswordService } from '../services/password-service';

// These are all the attributes in the User model
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name?: string | null;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public email!: string;
  public password!: string;
  public name!: string | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getCells!: HasManyGetAssociationsMixin<Cell>; // Note the null assertions!
  public addCell!: HasManyAddAssociationMixin<Cell, number>;
  public hasCell!: HasManyHasAssociationMixin<Cell, number>;
  public countCells!: HasManyCountAssociationsMixin;
  public createCell!: HasManyCreateAssociationMixin<Cell>;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  public readonly cells?: Cell[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    cells: Association<User, Cell>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'E-mail is not valid' },
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      validate: {
        isAlpha: { msg: 'Name should consist of letters only' },
      },
    },
  },
  {
    tableName: 'users',
    sequelize: db, // passing the `sequelize` instance is required
    hooks: {
      beforeCreate: async function(user) {
        user.password = await PasswordService.hashPassword(user.password);
      },
    },
  },
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
User.hasMany(Cell, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
  as: 'cells', // this determines the name in `associations`!
})
