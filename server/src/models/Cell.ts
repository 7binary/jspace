import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../db';
import { nanoid } from 'nanoid';

export type CellType = 'code' | 'text';

interface CellAttributes {
  id: number;
  ownerId?: number;
  type: CellType;
  content: string;
  uuid: string;
  lastViewAt?: Date;
}

interface CellCreationAttributes extends Optional<CellAttributes, 'id' | 'uuid'> {}

export class Cell extends Model<CellAttributes, CellCreationAttributes>
  implements CellAttributes {
  public id!: number;
  public ownerId!: number | undefined;
  public type!: CellType;
  public content!: string;
  public uuid!: string;
  public lastViewAt!: Date | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  toJSON(): object {
    const { uuid, content, type } = this.get();
    return { uuid, content, type };
  }
}

Cell.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
  uuid: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  lastViewAt: DataTypes.DATE,
  ownerId: DataTypes.INTEGER,
}, {
  tableName: 'cells',
  sequelize: db,
  hooks: {
    beforeValidate: async function(cell) {
      if (!cell.uuid) cell.uuid = nanoid(7);
    },
    beforeCreate: async function(cell) {
      if (!cell.uuid) cell.uuid = nanoid(7);
    },
  },
});
