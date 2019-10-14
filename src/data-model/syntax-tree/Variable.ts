/**
 * Dataclass for variables that consists of a name and a datatype
 *
 * @export
 * @class Variable
 */
export class Variable {
  private name: string;
  private dataType: string;

  /**
   * Creates an instance of Variable.
   * @param {string} name name of the variable
   * @param {string} datatype datatype of the variable
   * @memberof Variable
   */
  constructor(name: string, datatype: string) {
    this.name = name;
    this.dataType = datatype;
  }

  public get $name(): string {
    return this.name;
  }
  public set $name(value: string) {
    this.name = value;
  }
  public get $dataType(): string {
    return this.dataType;
  }
  public set $dataType(value: string) {
    this.dataType = value;
  }
}
