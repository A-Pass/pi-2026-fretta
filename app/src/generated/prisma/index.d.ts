
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model UnidadeFederativa
 * 
 */
export type UnidadeFederativa = $Result.DefaultSelection<Prisma.$UnidadeFederativaPayload>
/**
 * Model Cidade
 * 
 */
export type Cidade = $Result.DefaultSelection<Prisma.$CidadePayload>
/**
 * Model Bairro
 * 
 */
export type Bairro = $Result.DefaultSelection<Prisma.$BairroPayload>
/**
 * Model Logradouro
 * 
 */
export type Logradouro = $Result.DefaultSelection<Prisma.$LogradouroPayload>
/**
 * Model Pessoa
 * 
 */
export type Pessoa = $Result.DefaultSelection<Prisma.$PessoaPayload>
/**
 * Model Endereco
 * 
 */
export type Endereco = $Result.DefaultSelection<Prisma.$EnderecoPayload>
/**
 * Model Profissional
 * 
 */
export type Profissional = $Result.DefaultSelection<Prisma.$ProfissionalPayload>
/**
 * Model servico_cliente
 * 
 */
export type servico_cliente = $Result.DefaultSelection<Prisma.$servico_clientePayload>
/**
 * Model servico_cliente_foto
 * 
 */
export type servico_cliente_foto = $Result.DefaultSelection<Prisma.$servico_cliente_fotoPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SiglaUF: {
  AC: 'AC',
  AL: 'AL',
  AP: 'AP',
  AM: 'AM',
  BA: 'BA',
  CE: 'CE',
  DF: 'DF',
  ES: 'ES',
  GO: 'GO',
  MA: 'MA',
  MT: 'MT',
  MS: 'MS',
  MG: 'MG',
  PA: 'PA',
  PB: 'PB',
  PR: 'PR',
  PE: 'PE',
  PI: 'PI',
  RJ: 'RJ',
  RN: 'RN',
  RS: 'RS',
  RO: 'RO',
  RR: 'RR',
  SC: 'SC',
  SP: 'SP',
  SE: 'SE',
  TO: 'TO'
};

export type SiglaUF = (typeof SiglaUF)[keyof typeof SiglaUF]


export const Regiao: {
  NORTE: 'NORTE',
  NORDESTE: 'NORDESTE',
  SUDESTE: 'SUDESTE',
  SUL: 'SUL',
  CENTRO_OESTE: 'CENTRO_OESTE'
};

export type Regiao = (typeof Regiao)[keyof typeof Regiao]


export const enum_servico_cliente_status: {
  ABERTO: 'ABERTO',
  NEGOCIANDO: 'NEGOCIANDO',
  CONTRATADO: 'CONTRATADO',
  CANCELADO: 'CANCELADO'
};

export type enum_servico_cliente_status = (typeof enum_servico_cliente_status)[keyof typeof enum_servico_cliente_status]

}

export type SiglaUF = $Enums.SiglaUF

export const SiglaUF: typeof $Enums.SiglaUF

export type Regiao = $Enums.Regiao

export const Regiao: typeof $Enums.Regiao

export type enum_servico_cliente_status = $Enums.enum_servico_cliente_status

export const enum_servico_cliente_status: typeof $Enums.enum_servico_cliente_status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unidadeFederativa`: Exposes CRUD operations for the **UnidadeFederativa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnidadeFederativas
    * const unidadeFederativas = await prisma.unidadeFederativa.findMany()
    * ```
    */
  get unidadeFederativa(): Prisma.UnidadeFederativaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cidade`: Exposes CRUD operations for the **Cidade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cidades
    * const cidades = await prisma.cidade.findMany()
    * ```
    */
  get cidade(): Prisma.CidadeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bairro`: Exposes CRUD operations for the **Bairro** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bairros
    * const bairros = await prisma.bairro.findMany()
    * ```
    */
  get bairro(): Prisma.BairroDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.logradouro`: Exposes CRUD operations for the **Logradouro** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Logradouros
    * const logradouros = await prisma.logradouro.findMany()
    * ```
    */
  get logradouro(): Prisma.LogradouroDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pessoa`: Exposes CRUD operations for the **Pessoa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pessoas
    * const pessoas = await prisma.pessoa.findMany()
    * ```
    */
  get pessoa(): Prisma.PessoaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.endereco`: Exposes CRUD operations for the **Endereco** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Enderecos
    * const enderecos = await prisma.endereco.findMany()
    * ```
    */
  get endereco(): Prisma.EnderecoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profissional`: Exposes CRUD operations for the **Profissional** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profissionals
    * const profissionals = await prisma.profissional.findMany()
    * ```
    */
  get profissional(): Prisma.ProfissionalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.servico_cliente`: Exposes CRUD operations for the **servico_cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servico_clientes
    * const servico_clientes = await prisma.servico_cliente.findMany()
    * ```
    */
  get servico_cliente(): Prisma.servico_clienteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.servico_cliente_foto`: Exposes CRUD operations for the **servico_cliente_foto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servico_cliente_fotos
    * const servico_cliente_fotos = await prisma.servico_cliente_foto.findMany()
    * ```
    */
  get servico_cliente_foto(): Prisma.servico_cliente_fotoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    UnidadeFederativa: 'UnidadeFederativa',
    Cidade: 'Cidade',
    Bairro: 'Bairro',
    Logradouro: 'Logradouro',
    Pessoa: 'Pessoa',
    Endereco: 'Endereco',
    Profissional: 'Profissional',
    servico_cliente: 'servico_cliente',
    servico_cliente_foto: 'servico_cliente_foto'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "verification" | "unidadeFederativa" | "cidade" | "bairro" | "logradouro" | "pessoa" | "endereco" | "profissional" | "servico_cliente" | "servico_cliente_foto"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      UnidadeFederativa: {
        payload: Prisma.$UnidadeFederativaPayload<ExtArgs>
        fields: Prisma.UnidadeFederativaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnidadeFederativaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnidadeFederativaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>
          }
          findFirst: {
            args: Prisma.UnidadeFederativaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnidadeFederativaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>
          }
          findMany: {
            args: Prisma.UnidadeFederativaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>[]
          }
          create: {
            args: Prisma.UnidadeFederativaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>
          }
          createMany: {
            args: Prisma.UnidadeFederativaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UnidadeFederativaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>[]
          }
          delete: {
            args: Prisma.UnidadeFederativaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>
          }
          update: {
            args: Prisma.UnidadeFederativaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>
          }
          deleteMany: {
            args: Prisma.UnidadeFederativaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnidadeFederativaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UnidadeFederativaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>[]
          }
          upsert: {
            args: Prisma.UnidadeFederativaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadeFederativaPayload>
          }
          aggregate: {
            args: Prisma.UnidadeFederativaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnidadeFederativa>
          }
          groupBy: {
            args: Prisma.UnidadeFederativaGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnidadeFederativaGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnidadeFederativaCountArgs<ExtArgs>
            result: $Utils.Optional<UnidadeFederativaCountAggregateOutputType> | number
          }
        }
      }
      Cidade: {
        payload: Prisma.$CidadePayload<ExtArgs>
        fields: Prisma.CidadeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CidadeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CidadeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>
          }
          findFirst: {
            args: Prisma.CidadeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CidadeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>
          }
          findMany: {
            args: Prisma.CidadeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>[]
          }
          create: {
            args: Prisma.CidadeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>
          }
          createMany: {
            args: Prisma.CidadeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CidadeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>[]
          }
          delete: {
            args: Prisma.CidadeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>
          }
          update: {
            args: Prisma.CidadeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>
          }
          deleteMany: {
            args: Prisma.CidadeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CidadeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CidadeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>[]
          }
          upsert: {
            args: Prisma.CidadeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CidadePayload>
          }
          aggregate: {
            args: Prisma.CidadeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCidade>
          }
          groupBy: {
            args: Prisma.CidadeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CidadeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CidadeCountArgs<ExtArgs>
            result: $Utils.Optional<CidadeCountAggregateOutputType> | number
          }
        }
      }
      Bairro: {
        payload: Prisma.$BairroPayload<ExtArgs>
        fields: Prisma.BairroFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BairroFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BairroFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>
          }
          findFirst: {
            args: Prisma.BairroFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BairroFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>
          }
          findMany: {
            args: Prisma.BairroFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>[]
          }
          create: {
            args: Prisma.BairroCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>
          }
          createMany: {
            args: Prisma.BairroCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BairroCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>[]
          }
          delete: {
            args: Prisma.BairroDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>
          }
          update: {
            args: Prisma.BairroUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>
          }
          deleteMany: {
            args: Prisma.BairroDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BairroUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BairroUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>[]
          }
          upsert: {
            args: Prisma.BairroUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BairroPayload>
          }
          aggregate: {
            args: Prisma.BairroAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBairro>
          }
          groupBy: {
            args: Prisma.BairroGroupByArgs<ExtArgs>
            result: $Utils.Optional<BairroGroupByOutputType>[]
          }
          count: {
            args: Prisma.BairroCountArgs<ExtArgs>
            result: $Utils.Optional<BairroCountAggregateOutputType> | number
          }
        }
      }
      Logradouro: {
        payload: Prisma.$LogradouroPayload<ExtArgs>
        fields: Prisma.LogradouroFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LogradouroFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LogradouroFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>
          }
          findFirst: {
            args: Prisma.LogradouroFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LogradouroFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>
          }
          findMany: {
            args: Prisma.LogradouroFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>[]
          }
          create: {
            args: Prisma.LogradouroCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>
          }
          createMany: {
            args: Prisma.LogradouroCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LogradouroCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>[]
          }
          delete: {
            args: Prisma.LogradouroDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>
          }
          update: {
            args: Prisma.LogradouroUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>
          }
          deleteMany: {
            args: Prisma.LogradouroDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LogradouroUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LogradouroUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>[]
          }
          upsert: {
            args: Prisma.LogradouroUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogradouroPayload>
          }
          aggregate: {
            args: Prisma.LogradouroAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLogradouro>
          }
          groupBy: {
            args: Prisma.LogradouroGroupByArgs<ExtArgs>
            result: $Utils.Optional<LogradouroGroupByOutputType>[]
          }
          count: {
            args: Prisma.LogradouroCountArgs<ExtArgs>
            result: $Utils.Optional<LogradouroCountAggregateOutputType> | number
          }
        }
      }
      Pessoa: {
        payload: Prisma.$PessoaPayload<ExtArgs>
        fields: Prisma.PessoaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PessoaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PessoaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          findFirst: {
            args: Prisma.PessoaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PessoaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          findMany: {
            args: Prisma.PessoaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>[]
          }
          create: {
            args: Prisma.PessoaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          createMany: {
            args: Prisma.PessoaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PessoaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>[]
          }
          delete: {
            args: Prisma.PessoaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          update: {
            args: Prisma.PessoaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          deleteMany: {
            args: Prisma.PessoaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PessoaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PessoaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>[]
          }
          upsert: {
            args: Prisma.PessoaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          aggregate: {
            args: Prisma.PessoaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePessoa>
          }
          groupBy: {
            args: Prisma.PessoaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PessoaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PessoaCountArgs<ExtArgs>
            result: $Utils.Optional<PessoaCountAggregateOutputType> | number
          }
        }
      }
      Endereco: {
        payload: Prisma.$EnderecoPayload<ExtArgs>
        fields: Prisma.EnderecoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnderecoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnderecoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          findFirst: {
            args: Prisma.EnderecoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnderecoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          findMany: {
            args: Prisma.EnderecoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>[]
          }
          create: {
            args: Prisma.EnderecoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          createMany: {
            args: Prisma.EnderecoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnderecoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>[]
          }
          delete: {
            args: Prisma.EnderecoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          update: {
            args: Prisma.EnderecoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          deleteMany: {
            args: Prisma.EnderecoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnderecoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EnderecoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>[]
          }
          upsert: {
            args: Prisma.EnderecoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          aggregate: {
            args: Prisma.EnderecoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEndereco>
          }
          groupBy: {
            args: Prisma.EnderecoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnderecoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnderecoCountArgs<ExtArgs>
            result: $Utils.Optional<EnderecoCountAggregateOutputType> | number
          }
        }
      }
      Profissional: {
        payload: Prisma.$ProfissionalPayload<ExtArgs>
        fields: Prisma.ProfissionalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfissionalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfissionalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>
          }
          findFirst: {
            args: Prisma.ProfissionalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfissionalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>
          }
          findMany: {
            args: Prisma.ProfissionalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>[]
          }
          create: {
            args: Prisma.ProfissionalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>
          }
          createMany: {
            args: Prisma.ProfissionalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfissionalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>[]
          }
          delete: {
            args: Prisma.ProfissionalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>
          }
          update: {
            args: Prisma.ProfissionalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>
          }
          deleteMany: {
            args: Prisma.ProfissionalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfissionalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfissionalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>[]
          }
          upsert: {
            args: Prisma.ProfissionalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfissionalPayload>
          }
          aggregate: {
            args: Prisma.ProfissionalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfissional>
          }
          groupBy: {
            args: Prisma.ProfissionalGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfissionalGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfissionalCountArgs<ExtArgs>
            result: $Utils.Optional<ProfissionalCountAggregateOutputType> | number
          }
        }
      }
      servico_cliente: {
        payload: Prisma.$servico_clientePayload<ExtArgs>
        fields: Prisma.servico_clienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.servico_clienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.servico_clienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>
          }
          findFirst: {
            args: Prisma.servico_clienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.servico_clienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>
          }
          findMany: {
            args: Prisma.servico_clienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>[]
          }
          create: {
            args: Prisma.servico_clienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>
          }
          createMany: {
            args: Prisma.servico_clienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.servico_clienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>[]
          }
          delete: {
            args: Prisma.servico_clienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>
          }
          update: {
            args: Prisma.servico_clienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>
          }
          deleteMany: {
            args: Prisma.servico_clienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.servico_clienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.servico_clienteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>[]
          }
          upsert: {
            args: Prisma.servico_clienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_clientePayload>
          }
          aggregate: {
            args: Prisma.Servico_clienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServico_cliente>
          }
          groupBy: {
            args: Prisma.servico_clienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<Servico_clienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.servico_clienteCountArgs<ExtArgs>
            result: $Utils.Optional<Servico_clienteCountAggregateOutputType> | number
          }
        }
      }
      servico_cliente_foto: {
        payload: Prisma.$servico_cliente_fotoPayload<ExtArgs>
        fields: Prisma.servico_cliente_fotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.servico_cliente_fotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.servico_cliente_fotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>
          }
          findFirst: {
            args: Prisma.servico_cliente_fotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.servico_cliente_fotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>
          }
          findMany: {
            args: Prisma.servico_cliente_fotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>[]
          }
          create: {
            args: Prisma.servico_cliente_fotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>
          }
          createMany: {
            args: Prisma.servico_cliente_fotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.servico_cliente_fotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>[]
          }
          delete: {
            args: Prisma.servico_cliente_fotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>
          }
          update: {
            args: Prisma.servico_cliente_fotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>
          }
          deleteMany: {
            args: Prisma.servico_cliente_fotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.servico_cliente_fotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.servico_cliente_fotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>[]
          }
          upsert: {
            args: Prisma.servico_cliente_fotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$servico_cliente_fotoPayload>
          }
          aggregate: {
            args: Prisma.Servico_cliente_fotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServico_cliente_foto>
          }
          groupBy: {
            args: Prisma.servico_cliente_fotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<Servico_cliente_fotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.servico_cliente_fotoCountArgs<ExtArgs>
            result: $Utils.Optional<Servico_cliente_fotoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    unidadeFederativa?: UnidadeFederativaOmit
    cidade?: CidadeOmit
    bairro?: BairroOmit
    logradouro?: LogradouroOmit
    pessoa?: PessoaOmit
    endereco?: EnderecoOmit
    profissional?: ProfissionalOmit
    servico_cliente?: servico_clienteOmit
    servico_cliente_foto?: servico_cliente_fotoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }


  /**
   * Count Type UnidadeFederativaCountOutputType
   */

  export type UnidadeFederativaCountOutputType = {
    cidades: number
  }

  export type UnidadeFederativaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cidades?: boolean | UnidadeFederativaCountOutputTypeCountCidadesArgs
  }

  // Custom InputTypes
  /**
   * UnidadeFederativaCountOutputType without action
   */
  export type UnidadeFederativaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativaCountOutputType
     */
    select?: UnidadeFederativaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UnidadeFederativaCountOutputType without action
   */
  export type UnidadeFederativaCountOutputTypeCountCidadesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CidadeWhereInput
  }


  /**
   * Count Type CidadeCountOutputType
   */

  export type CidadeCountOutputType = {
    bairros: number
  }

  export type CidadeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bairros?: boolean | CidadeCountOutputTypeCountBairrosArgs
  }

  // Custom InputTypes
  /**
   * CidadeCountOutputType without action
   */
  export type CidadeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CidadeCountOutputType
     */
    select?: CidadeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CidadeCountOutputType without action
   */
  export type CidadeCountOutputTypeCountBairrosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BairroWhereInput
  }


  /**
   * Count Type BairroCountOutputType
   */

  export type BairroCountOutputType = {
    logradouro: number
  }

  export type BairroCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logradouro?: boolean | BairroCountOutputTypeCountLogradouroArgs
  }

  // Custom InputTypes
  /**
   * BairroCountOutputType without action
   */
  export type BairroCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BairroCountOutputType
     */
    select?: BairroCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BairroCountOutputType without action
   */
  export type BairroCountOutputTypeCountLogradouroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LogradouroWhereInput
  }


  /**
   * Count Type LogradouroCountOutputType
   */

  export type LogradouroCountOutputType = {
    enderecos: number
  }

  export type LogradouroCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enderecos?: boolean | LogradouroCountOutputTypeCountEnderecosArgs
  }

  // Custom InputTypes
  /**
   * LogradouroCountOutputType without action
   */
  export type LogradouroCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogradouroCountOutputType
     */
    select?: LogradouroCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LogradouroCountOutputType without action
   */
  export type LogradouroCountOutputTypeCountEnderecosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnderecoWhereInput
  }


  /**
   * Count Type PessoaCountOutputType
   */

  export type PessoaCountOutputType = {
    enderecos: number
    servico_cliente: number
  }

  export type PessoaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enderecos?: boolean | PessoaCountOutputTypeCountEnderecosArgs
    servico_cliente?: boolean | PessoaCountOutputTypeCountServico_clienteArgs
  }

  // Custom InputTypes
  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PessoaCountOutputType
     */
    select?: PessoaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeCountEnderecosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnderecoWhereInput
  }

  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeCountServico_clienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: servico_clienteWhereInput
  }


  /**
   * Count Type Servico_clienteCountOutputType
   */

  export type Servico_clienteCountOutputType = {
    fotos: number
  }

  export type Servico_clienteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fotos?: boolean | Servico_clienteCountOutputTypeCountFotosArgs
  }

  // Custom InputTypes
  /**
   * Servico_clienteCountOutputType without action
   */
  export type Servico_clienteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico_clienteCountOutputType
     */
    select?: Servico_clienteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Servico_clienteCountOutputType without action
   */
  export type Servico_clienteCountOutputTypeCountFotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: servico_cliente_fotoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    pessoa?: boolean | User$pessoaArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    pessoa?: boolean | User$pessoaArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      pessoa: Prisma.$PessoaPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pessoa<T extends User$pessoaArgs<ExtArgs> = {}>(args?: Subset<T, User$pessoaArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.pessoa
   */
  export type User$pessoaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    where?: PessoaWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model UnidadeFederativa
   */

  export type AggregateUnidadeFederativa = {
    _count: UnidadeFederativaCountAggregateOutputType | null
    _min: UnidadeFederativaMinAggregateOutputType | null
    _max: UnidadeFederativaMaxAggregateOutputType | null
  }

  export type UnidadeFederativaMinAggregateOutputType = {
    sigla: $Enums.SiglaUF | null
    nome: string | null
    regiao: $Enums.Regiao | null
  }

  export type UnidadeFederativaMaxAggregateOutputType = {
    sigla: $Enums.SiglaUF | null
    nome: string | null
    regiao: $Enums.Regiao | null
  }

  export type UnidadeFederativaCountAggregateOutputType = {
    sigla: number
    nome: number
    regiao: number
    _all: number
  }


  export type UnidadeFederativaMinAggregateInputType = {
    sigla?: true
    nome?: true
    regiao?: true
  }

  export type UnidadeFederativaMaxAggregateInputType = {
    sigla?: true
    nome?: true
    regiao?: true
  }

  export type UnidadeFederativaCountAggregateInputType = {
    sigla?: true
    nome?: true
    regiao?: true
    _all?: true
  }

  export type UnidadeFederativaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnidadeFederativa to aggregate.
     */
    where?: UnidadeFederativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFederativas to fetch.
     */
    orderBy?: UnidadeFederativaOrderByWithRelationInput | UnidadeFederativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnidadeFederativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFederativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFederativas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnidadeFederativas
    **/
    _count?: true | UnidadeFederativaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnidadeFederativaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnidadeFederativaMaxAggregateInputType
  }

  export type GetUnidadeFederativaAggregateType<T extends UnidadeFederativaAggregateArgs> = {
        [P in keyof T & keyof AggregateUnidadeFederativa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnidadeFederativa[P]>
      : GetScalarType<T[P], AggregateUnidadeFederativa[P]>
  }




  export type UnidadeFederativaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnidadeFederativaWhereInput
    orderBy?: UnidadeFederativaOrderByWithAggregationInput | UnidadeFederativaOrderByWithAggregationInput[]
    by: UnidadeFederativaScalarFieldEnum[] | UnidadeFederativaScalarFieldEnum
    having?: UnidadeFederativaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnidadeFederativaCountAggregateInputType | true
    _min?: UnidadeFederativaMinAggregateInputType
    _max?: UnidadeFederativaMaxAggregateInputType
  }

  export type UnidadeFederativaGroupByOutputType = {
    sigla: $Enums.SiglaUF
    nome: string
    regiao: $Enums.Regiao
    _count: UnidadeFederativaCountAggregateOutputType | null
    _min: UnidadeFederativaMinAggregateOutputType | null
    _max: UnidadeFederativaMaxAggregateOutputType | null
  }

  type GetUnidadeFederativaGroupByPayload<T extends UnidadeFederativaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnidadeFederativaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnidadeFederativaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnidadeFederativaGroupByOutputType[P]>
            : GetScalarType<T[P], UnidadeFederativaGroupByOutputType[P]>
        }
      >
    >


  export type UnidadeFederativaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sigla?: boolean
    nome?: boolean
    regiao?: boolean
    cidades?: boolean | UnidadeFederativa$cidadesArgs<ExtArgs>
    _count?: boolean | UnidadeFederativaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["unidadeFederativa"]>

  export type UnidadeFederativaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sigla?: boolean
    nome?: boolean
    regiao?: boolean
  }, ExtArgs["result"]["unidadeFederativa"]>

  export type UnidadeFederativaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sigla?: boolean
    nome?: boolean
    regiao?: boolean
  }, ExtArgs["result"]["unidadeFederativa"]>

  export type UnidadeFederativaSelectScalar = {
    sigla?: boolean
    nome?: boolean
    regiao?: boolean
  }

  export type UnidadeFederativaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"sigla" | "nome" | "regiao", ExtArgs["result"]["unidadeFederativa"]>
  export type UnidadeFederativaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cidades?: boolean | UnidadeFederativa$cidadesArgs<ExtArgs>
    _count?: boolean | UnidadeFederativaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UnidadeFederativaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UnidadeFederativaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UnidadeFederativaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UnidadeFederativa"
    objects: {
      cidades: Prisma.$CidadePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      sigla: $Enums.SiglaUF
      nome: string
      regiao: $Enums.Regiao
    }, ExtArgs["result"]["unidadeFederativa"]>
    composites: {}
  }

  type UnidadeFederativaGetPayload<S extends boolean | null | undefined | UnidadeFederativaDefaultArgs> = $Result.GetResult<Prisma.$UnidadeFederativaPayload, S>

  type UnidadeFederativaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnidadeFederativaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnidadeFederativaCountAggregateInputType | true
    }

  export interface UnidadeFederativaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnidadeFederativa'], meta: { name: 'UnidadeFederativa' } }
    /**
     * Find zero or one UnidadeFederativa that matches the filter.
     * @param {UnidadeFederativaFindUniqueArgs} args - Arguments to find a UnidadeFederativa
     * @example
     * // Get one UnidadeFederativa
     * const unidadeFederativa = await prisma.unidadeFederativa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnidadeFederativaFindUniqueArgs>(args: SelectSubset<T, UnidadeFederativaFindUniqueArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UnidadeFederativa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnidadeFederativaFindUniqueOrThrowArgs} args - Arguments to find a UnidadeFederativa
     * @example
     * // Get one UnidadeFederativa
     * const unidadeFederativa = await prisma.unidadeFederativa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnidadeFederativaFindUniqueOrThrowArgs>(args: SelectSubset<T, UnidadeFederativaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnidadeFederativa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaFindFirstArgs} args - Arguments to find a UnidadeFederativa
     * @example
     * // Get one UnidadeFederativa
     * const unidadeFederativa = await prisma.unidadeFederativa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnidadeFederativaFindFirstArgs>(args?: SelectSubset<T, UnidadeFederativaFindFirstArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnidadeFederativa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaFindFirstOrThrowArgs} args - Arguments to find a UnidadeFederativa
     * @example
     * // Get one UnidadeFederativa
     * const unidadeFederativa = await prisma.unidadeFederativa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnidadeFederativaFindFirstOrThrowArgs>(args?: SelectSubset<T, UnidadeFederativaFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UnidadeFederativas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnidadeFederativas
     * const unidadeFederativas = await prisma.unidadeFederativa.findMany()
     * 
     * // Get first 10 UnidadeFederativas
     * const unidadeFederativas = await prisma.unidadeFederativa.findMany({ take: 10 })
     * 
     * // Only select the `nome`
     * const unidadeFederativaWithNomeOnly = await prisma.unidadeFederativa.findMany({ select: { nome: true } })
     * 
     */
    findMany<T extends UnidadeFederativaFindManyArgs>(args?: SelectSubset<T, UnidadeFederativaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UnidadeFederativa.
     * @param {UnidadeFederativaCreateArgs} args - Arguments to create a UnidadeFederativa.
     * @example
     * // Create one UnidadeFederativa
     * const UnidadeFederativa = await prisma.unidadeFederativa.create({
     *   data: {
     *     // ... data to create a UnidadeFederativa
     *   }
     * })
     * 
     */
    create<T extends UnidadeFederativaCreateArgs>(args: SelectSubset<T, UnidadeFederativaCreateArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UnidadeFederativas.
     * @param {UnidadeFederativaCreateManyArgs} args - Arguments to create many UnidadeFederativas.
     * @example
     * // Create many UnidadeFederativas
     * const unidadeFederativa = await prisma.unidadeFederativa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnidadeFederativaCreateManyArgs>(args?: SelectSubset<T, UnidadeFederativaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UnidadeFederativas and returns the data saved in the database.
     * @param {UnidadeFederativaCreateManyAndReturnArgs} args - Arguments to create many UnidadeFederativas.
     * @example
     * // Create many UnidadeFederativas
     * const unidadeFederativa = await prisma.unidadeFederativa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UnidadeFederativas and only return the `nome`
     * const unidadeFederativaWithNomeOnly = await prisma.unidadeFederativa.createManyAndReturn({
     *   select: { nome: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UnidadeFederativaCreateManyAndReturnArgs>(args?: SelectSubset<T, UnidadeFederativaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UnidadeFederativa.
     * @param {UnidadeFederativaDeleteArgs} args - Arguments to delete one UnidadeFederativa.
     * @example
     * // Delete one UnidadeFederativa
     * const UnidadeFederativa = await prisma.unidadeFederativa.delete({
     *   where: {
     *     // ... filter to delete one UnidadeFederativa
     *   }
     * })
     * 
     */
    delete<T extends UnidadeFederativaDeleteArgs>(args: SelectSubset<T, UnidadeFederativaDeleteArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UnidadeFederativa.
     * @param {UnidadeFederativaUpdateArgs} args - Arguments to update one UnidadeFederativa.
     * @example
     * // Update one UnidadeFederativa
     * const unidadeFederativa = await prisma.unidadeFederativa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnidadeFederativaUpdateArgs>(args: SelectSubset<T, UnidadeFederativaUpdateArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UnidadeFederativas.
     * @param {UnidadeFederativaDeleteManyArgs} args - Arguments to filter UnidadeFederativas to delete.
     * @example
     * // Delete a few UnidadeFederativas
     * const { count } = await prisma.unidadeFederativa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnidadeFederativaDeleteManyArgs>(args?: SelectSubset<T, UnidadeFederativaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnidadeFederativas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnidadeFederativas
     * const unidadeFederativa = await prisma.unidadeFederativa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnidadeFederativaUpdateManyArgs>(args: SelectSubset<T, UnidadeFederativaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnidadeFederativas and returns the data updated in the database.
     * @param {UnidadeFederativaUpdateManyAndReturnArgs} args - Arguments to update many UnidadeFederativas.
     * @example
     * // Update many UnidadeFederativas
     * const unidadeFederativa = await prisma.unidadeFederativa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UnidadeFederativas and only return the `nome`
     * const unidadeFederativaWithNomeOnly = await prisma.unidadeFederativa.updateManyAndReturn({
     *   select: { nome: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UnidadeFederativaUpdateManyAndReturnArgs>(args: SelectSubset<T, UnidadeFederativaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UnidadeFederativa.
     * @param {UnidadeFederativaUpsertArgs} args - Arguments to update or create a UnidadeFederativa.
     * @example
     * // Update or create a UnidadeFederativa
     * const unidadeFederativa = await prisma.unidadeFederativa.upsert({
     *   create: {
     *     // ... data to create a UnidadeFederativa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnidadeFederativa we want to update
     *   }
     * })
     */
    upsert<T extends UnidadeFederativaUpsertArgs>(args: SelectSubset<T, UnidadeFederativaUpsertArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UnidadeFederativas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaCountArgs} args - Arguments to filter UnidadeFederativas to count.
     * @example
     * // Count the number of UnidadeFederativas
     * const count = await prisma.unidadeFederativa.count({
     *   where: {
     *     // ... the filter for the UnidadeFederativas we want to count
     *   }
     * })
    **/
    count<T extends UnidadeFederativaCountArgs>(
      args?: Subset<T, UnidadeFederativaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnidadeFederativaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnidadeFederativa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnidadeFederativaAggregateArgs>(args: Subset<T, UnidadeFederativaAggregateArgs>): Prisma.PrismaPromise<GetUnidadeFederativaAggregateType<T>>

    /**
     * Group by UnidadeFederativa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFederativaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UnidadeFederativaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnidadeFederativaGroupByArgs['orderBy'] }
        : { orderBy?: UnidadeFederativaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UnidadeFederativaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnidadeFederativaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UnidadeFederativa model
   */
  readonly fields: UnidadeFederativaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UnidadeFederativa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnidadeFederativaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cidades<T extends UnidadeFederativa$cidadesArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeFederativa$cidadesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UnidadeFederativa model
   */
  interface UnidadeFederativaFieldRefs {
    readonly sigla: FieldRef<"UnidadeFederativa", 'SiglaUF'>
    readonly nome: FieldRef<"UnidadeFederativa", 'String'>
    readonly regiao: FieldRef<"UnidadeFederativa", 'Regiao'>
  }
    

  // Custom InputTypes
  /**
   * UnidadeFederativa findUnique
   */
  export type UnidadeFederativaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFederativa to fetch.
     */
    where: UnidadeFederativaWhereUniqueInput
  }

  /**
   * UnidadeFederativa findUniqueOrThrow
   */
  export type UnidadeFederativaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFederativa to fetch.
     */
    where: UnidadeFederativaWhereUniqueInput
  }

  /**
   * UnidadeFederativa findFirst
   */
  export type UnidadeFederativaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFederativa to fetch.
     */
    where?: UnidadeFederativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFederativas to fetch.
     */
    orderBy?: UnidadeFederativaOrderByWithRelationInput | UnidadeFederativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnidadeFederativas.
     */
    cursor?: UnidadeFederativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFederativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFederativas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnidadeFederativas.
     */
    distinct?: UnidadeFederativaScalarFieldEnum | UnidadeFederativaScalarFieldEnum[]
  }

  /**
   * UnidadeFederativa findFirstOrThrow
   */
  export type UnidadeFederativaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFederativa to fetch.
     */
    where?: UnidadeFederativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFederativas to fetch.
     */
    orderBy?: UnidadeFederativaOrderByWithRelationInput | UnidadeFederativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnidadeFederativas.
     */
    cursor?: UnidadeFederativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFederativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFederativas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnidadeFederativas.
     */
    distinct?: UnidadeFederativaScalarFieldEnum | UnidadeFederativaScalarFieldEnum[]
  }

  /**
   * UnidadeFederativa findMany
   */
  export type UnidadeFederativaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFederativas to fetch.
     */
    where?: UnidadeFederativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFederativas to fetch.
     */
    orderBy?: UnidadeFederativaOrderByWithRelationInput | UnidadeFederativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnidadeFederativas.
     */
    cursor?: UnidadeFederativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFederativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFederativas.
     */
    skip?: number
    distinct?: UnidadeFederativaScalarFieldEnum | UnidadeFederativaScalarFieldEnum[]
  }

  /**
   * UnidadeFederativa create
   */
  export type UnidadeFederativaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * The data needed to create a UnidadeFederativa.
     */
    data: XOR<UnidadeFederativaCreateInput, UnidadeFederativaUncheckedCreateInput>
  }

  /**
   * UnidadeFederativa createMany
   */
  export type UnidadeFederativaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnidadeFederativas.
     */
    data: UnidadeFederativaCreateManyInput | UnidadeFederativaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UnidadeFederativa createManyAndReturn
   */
  export type UnidadeFederativaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * The data used to create many UnidadeFederativas.
     */
    data: UnidadeFederativaCreateManyInput | UnidadeFederativaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UnidadeFederativa update
   */
  export type UnidadeFederativaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * The data needed to update a UnidadeFederativa.
     */
    data: XOR<UnidadeFederativaUpdateInput, UnidadeFederativaUncheckedUpdateInput>
    /**
     * Choose, which UnidadeFederativa to update.
     */
    where: UnidadeFederativaWhereUniqueInput
  }

  /**
   * UnidadeFederativa updateMany
   */
  export type UnidadeFederativaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnidadeFederativas.
     */
    data: XOR<UnidadeFederativaUpdateManyMutationInput, UnidadeFederativaUncheckedUpdateManyInput>
    /**
     * Filter which UnidadeFederativas to update
     */
    where?: UnidadeFederativaWhereInput
    /**
     * Limit how many UnidadeFederativas to update.
     */
    limit?: number
  }

  /**
   * UnidadeFederativa updateManyAndReturn
   */
  export type UnidadeFederativaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * The data used to update UnidadeFederativas.
     */
    data: XOR<UnidadeFederativaUpdateManyMutationInput, UnidadeFederativaUncheckedUpdateManyInput>
    /**
     * Filter which UnidadeFederativas to update
     */
    where?: UnidadeFederativaWhereInput
    /**
     * Limit how many UnidadeFederativas to update.
     */
    limit?: number
  }

  /**
   * UnidadeFederativa upsert
   */
  export type UnidadeFederativaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * The filter to search for the UnidadeFederativa to update in case it exists.
     */
    where: UnidadeFederativaWhereUniqueInput
    /**
     * In case the UnidadeFederativa found by the `where` argument doesn't exist, create a new UnidadeFederativa with this data.
     */
    create: XOR<UnidadeFederativaCreateInput, UnidadeFederativaUncheckedCreateInput>
    /**
     * In case the UnidadeFederativa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnidadeFederativaUpdateInput, UnidadeFederativaUncheckedUpdateInput>
  }

  /**
   * UnidadeFederativa delete
   */
  export type UnidadeFederativaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
    /**
     * Filter which UnidadeFederativa to delete.
     */
    where: UnidadeFederativaWhereUniqueInput
  }

  /**
   * UnidadeFederativa deleteMany
   */
  export type UnidadeFederativaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnidadeFederativas to delete
     */
    where?: UnidadeFederativaWhereInput
    /**
     * Limit how many UnidadeFederativas to delete.
     */
    limit?: number
  }

  /**
   * UnidadeFederativa.cidades
   */
  export type UnidadeFederativa$cidadesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    where?: CidadeWhereInput
    orderBy?: CidadeOrderByWithRelationInput | CidadeOrderByWithRelationInput[]
    cursor?: CidadeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CidadeScalarFieldEnum | CidadeScalarFieldEnum[]
  }

  /**
   * UnidadeFederativa without action
   */
  export type UnidadeFederativaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFederativa
     */
    select?: UnidadeFederativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnidadeFederativa
     */
    omit?: UnidadeFederativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadeFederativaInclude<ExtArgs> | null
  }


  /**
   * Model Cidade
   */

  export type AggregateCidade = {
    _count: CidadeCountAggregateOutputType | null
    _avg: CidadeAvgAggregateOutputType | null
    _sum: CidadeSumAggregateOutputType | null
    _min: CidadeMinAggregateOutputType | null
    _max: CidadeMaxAggregateOutputType | null
  }

  export type CidadeAvgAggregateOutputType = {
    id: number | null
  }

  export type CidadeSumAggregateOutputType = {
    id: number | null
  }

  export type CidadeMinAggregateOutputType = {
    id: number | null
    uf_sigla: $Enums.SiglaUF | null
    nome: string | null
    cep: string | null
    padrao: boolean | null
  }

  export type CidadeMaxAggregateOutputType = {
    id: number | null
    uf_sigla: $Enums.SiglaUF | null
    nome: string | null
    cep: string | null
    padrao: boolean | null
  }

  export type CidadeCountAggregateOutputType = {
    id: number
    uf_sigla: number
    nome: number
    cep: number
    padrao: number
    _all: number
  }


  export type CidadeAvgAggregateInputType = {
    id?: true
  }

  export type CidadeSumAggregateInputType = {
    id?: true
  }

  export type CidadeMinAggregateInputType = {
    id?: true
    uf_sigla?: true
    nome?: true
    cep?: true
    padrao?: true
  }

  export type CidadeMaxAggregateInputType = {
    id?: true
    uf_sigla?: true
    nome?: true
    cep?: true
    padrao?: true
  }

  export type CidadeCountAggregateInputType = {
    id?: true
    uf_sigla?: true
    nome?: true
    cep?: true
    padrao?: true
    _all?: true
  }

  export type CidadeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cidade to aggregate.
     */
    where?: CidadeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cidades to fetch.
     */
    orderBy?: CidadeOrderByWithRelationInput | CidadeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CidadeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cidades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cidades
    **/
    _count?: true | CidadeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CidadeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CidadeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CidadeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CidadeMaxAggregateInputType
  }

  export type GetCidadeAggregateType<T extends CidadeAggregateArgs> = {
        [P in keyof T & keyof AggregateCidade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCidade[P]>
      : GetScalarType<T[P], AggregateCidade[P]>
  }




  export type CidadeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CidadeWhereInput
    orderBy?: CidadeOrderByWithAggregationInput | CidadeOrderByWithAggregationInput[]
    by: CidadeScalarFieldEnum[] | CidadeScalarFieldEnum
    having?: CidadeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CidadeCountAggregateInputType | true
    _avg?: CidadeAvgAggregateInputType
    _sum?: CidadeSumAggregateInputType
    _min?: CidadeMinAggregateInputType
    _max?: CidadeMaxAggregateInputType
  }

  export type CidadeGroupByOutputType = {
    id: number
    uf_sigla: $Enums.SiglaUF
    nome: string
    cep: string | null
    padrao: boolean
    _count: CidadeCountAggregateOutputType | null
    _avg: CidadeAvgAggregateOutputType | null
    _sum: CidadeSumAggregateOutputType | null
    _min: CidadeMinAggregateOutputType | null
    _max: CidadeMaxAggregateOutputType | null
  }

  type GetCidadeGroupByPayload<T extends CidadeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CidadeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CidadeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CidadeGroupByOutputType[P]>
            : GetScalarType<T[P], CidadeGroupByOutputType[P]>
        }
      >
    >


  export type CidadeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uf_sigla?: boolean
    nome?: boolean
    cep?: boolean
    padrao?: boolean
    uf?: boolean | UnidadeFederativaDefaultArgs<ExtArgs>
    bairros?: boolean | Cidade$bairrosArgs<ExtArgs>
    _count?: boolean | CidadeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cidade"]>

  export type CidadeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uf_sigla?: boolean
    nome?: boolean
    cep?: boolean
    padrao?: boolean
    uf?: boolean | UnidadeFederativaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cidade"]>

  export type CidadeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uf_sigla?: boolean
    nome?: boolean
    cep?: boolean
    padrao?: boolean
    uf?: boolean | UnidadeFederativaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cidade"]>

  export type CidadeSelectScalar = {
    id?: boolean
    uf_sigla?: boolean
    nome?: boolean
    cep?: boolean
    padrao?: boolean
  }

  export type CidadeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uf_sigla" | "nome" | "cep" | "padrao", ExtArgs["result"]["cidade"]>
  export type CidadeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uf?: boolean | UnidadeFederativaDefaultArgs<ExtArgs>
    bairros?: boolean | Cidade$bairrosArgs<ExtArgs>
    _count?: boolean | CidadeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CidadeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uf?: boolean | UnidadeFederativaDefaultArgs<ExtArgs>
  }
  export type CidadeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uf?: boolean | UnidadeFederativaDefaultArgs<ExtArgs>
  }

  export type $CidadePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cidade"
    objects: {
      uf: Prisma.$UnidadeFederativaPayload<ExtArgs>
      bairros: Prisma.$BairroPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uf_sigla: $Enums.SiglaUF
      nome: string
      cep: string | null
      padrao: boolean
    }, ExtArgs["result"]["cidade"]>
    composites: {}
  }

  type CidadeGetPayload<S extends boolean | null | undefined | CidadeDefaultArgs> = $Result.GetResult<Prisma.$CidadePayload, S>

  type CidadeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CidadeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CidadeCountAggregateInputType | true
    }

  export interface CidadeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cidade'], meta: { name: 'Cidade' } }
    /**
     * Find zero or one Cidade that matches the filter.
     * @param {CidadeFindUniqueArgs} args - Arguments to find a Cidade
     * @example
     * // Get one Cidade
     * const cidade = await prisma.cidade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CidadeFindUniqueArgs>(args: SelectSubset<T, CidadeFindUniqueArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cidade that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CidadeFindUniqueOrThrowArgs} args - Arguments to find a Cidade
     * @example
     * // Get one Cidade
     * const cidade = await prisma.cidade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CidadeFindUniqueOrThrowArgs>(args: SelectSubset<T, CidadeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cidade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeFindFirstArgs} args - Arguments to find a Cidade
     * @example
     * // Get one Cidade
     * const cidade = await prisma.cidade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CidadeFindFirstArgs>(args?: SelectSubset<T, CidadeFindFirstArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cidade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeFindFirstOrThrowArgs} args - Arguments to find a Cidade
     * @example
     * // Get one Cidade
     * const cidade = await prisma.cidade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CidadeFindFirstOrThrowArgs>(args?: SelectSubset<T, CidadeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cidades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cidades
     * const cidades = await prisma.cidade.findMany()
     * 
     * // Get first 10 Cidades
     * const cidades = await prisma.cidade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cidadeWithIdOnly = await prisma.cidade.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CidadeFindManyArgs>(args?: SelectSubset<T, CidadeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cidade.
     * @param {CidadeCreateArgs} args - Arguments to create a Cidade.
     * @example
     * // Create one Cidade
     * const Cidade = await prisma.cidade.create({
     *   data: {
     *     // ... data to create a Cidade
     *   }
     * })
     * 
     */
    create<T extends CidadeCreateArgs>(args: SelectSubset<T, CidadeCreateArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cidades.
     * @param {CidadeCreateManyArgs} args - Arguments to create many Cidades.
     * @example
     * // Create many Cidades
     * const cidade = await prisma.cidade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CidadeCreateManyArgs>(args?: SelectSubset<T, CidadeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cidades and returns the data saved in the database.
     * @param {CidadeCreateManyAndReturnArgs} args - Arguments to create many Cidades.
     * @example
     * // Create many Cidades
     * const cidade = await prisma.cidade.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cidades and only return the `id`
     * const cidadeWithIdOnly = await prisma.cidade.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CidadeCreateManyAndReturnArgs>(args?: SelectSubset<T, CidadeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cidade.
     * @param {CidadeDeleteArgs} args - Arguments to delete one Cidade.
     * @example
     * // Delete one Cidade
     * const Cidade = await prisma.cidade.delete({
     *   where: {
     *     // ... filter to delete one Cidade
     *   }
     * })
     * 
     */
    delete<T extends CidadeDeleteArgs>(args: SelectSubset<T, CidadeDeleteArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cidade.
     * @param {CidadeUpdateArgs} args - Arguments to update one Cidade.
     * @example
     * // Update one Cidade
     * const cidade = await prisma.cidade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CidadeUpdateArgs>(args: SelectSubset<T, CidadeUpdateArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cidades.
     * @param {CidadeDeleteManyArgs} args - Arguments to filter Cidades to delete.
     * @example
     * // Delete a few Cidades
     * const { count } = await prisma.cidade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CidadeDeleteManyArgs>(args?: SelectSubset<T, CidadeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cidades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cidades
     * const cidade = await prisma.cidade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CidadeUpdateManyArgs>(args: SelectSubset<T, CidadeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cidades and returns the data updated in the database.
     * @param {CidadeUpdateManyAndReturnArgs} args - Arguments to update many Cidades.
     * @example
     * // Update many Cidades
     * const cidade = await prisma.cidade.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cidades and only return the `id`
     * const cidadeWithIdOnly = await prisma.cidade.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CidadeUpdateManyAndReturnArgs>(args: SelectSubset<T, CidadeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cidade.
     * @param {CidadeUpsertArgs} args - Arguments to update or create a Cidade.
     * @example
     * // Update or create a Cidade
     * const cidade = await prisma.cidade.upsert({
     *   create: {
     *     // ... data to create a Cidade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cidade we want to update
     *   }
     * })
     */
    upsert<T extends CidadeUpsertArgs>(args: SelectSubset<T, CidadeUpsertArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cidades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeCountArgs} args - Arguments to filter Cidades to count.
     * @example
     * // Count the number of Cidades
     * const count = await prisma.cidade.count({
     *   where: {
     *     // ... the filter for the Cidades we want to count
     *   }
     * })
    **/
    count<T extends CidadeCountArgs>(
      args?: Subset<T, CidadeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CidadeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cidade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CidadeAggregateArgs>(args: Subset<T, CidadeAggregateArgs>): Prisma.PrismaPromise<GetCidadeAggregateType<T>>

    /**
     * Group by Cidade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CidadeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CidadeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CidadeGroupByArgs['orderBy'] }
        : { orderBy?: CidadeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CidadeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCidadeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cidade model
   */
  readonly fields: CidadeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cidade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CidadeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    uf<T extends UnidadeFederativaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeFederativaDefaultArgs<ExtArgs>>): Prisma__UnidadeFederativaClient<$Result.GetResult<Prisma.$UnidadeFederativaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bairros<T extends Cidade$bairrosArgs<ExtArgs> = {}>(args?: Subset<T, Cidade$bairrosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cidade model
   */
  interface CidadeFieldRefs {
    readonly id: FieldRef<"Cidade", 'Int'>
    readonly uf_sigla: FieldRef<"Cidade", 'SiglaUF'>
    readonly nome: FieldRef<"Cidade", 'String'>
    readonly cep: FieldRef<"Cidade", 'String'>
    readonly padrao: FieldRef<"Cidade", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Cidade findUnique
   */
  export type CidadeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * Filter, which Cidade to fetch.
     */
    where: CidadeWhereUniqueInput
  }

  /**
   * Cidade findUniqueOrThrow
   */
  export type CidadeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * Filter, which Cidade to fetch.
     */
    where: CidadeWhereUniqueInput
  }

  /**
   * Cidade findFirst
   */
  export type CidadeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * Filter, which Cidade to fetch.
     */
    where?: CidadeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cidades to fetch.
     */
    orderBy?: CidadeOrderByWithRelationInput | CidadeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cidades.
     */
    cursor?: CidadeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cidades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cidades.
     */
    distinct?: CidadeScalarFieldEnum | CidadeScalarFieldEnum[]
  }

  /**
   * Cidade findFirstOrThrow
   */
  export type CidadeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * Filter, which Cidade to fetch.
     */
    where?: CidadeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cidades to fetch.
     */
    orderBy?: CidadeOrderByWithRelationInput | CidadeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cidades.
     */
    cursor?: CidadeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cidades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cidades.
     */
    distinct?: CidadeScalarFieldEnum | CidadeScalarFieldEnum[]
  }

  /**
   * Cidade findMany
   */
  export type CidadeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * Filter, which Cidades to fetch.
     */
    where?: CidadeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cidades to fetch.
     */
    orderBy?: CidadeOrderByWithRelationInput | CidadeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cidades.
     */
    cursor?: CidadeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cidades.
     */
    skip?: number
    distinct?: CidadeScalarFieldEnum | CidadeScalarFieldEnum[]
  }

  /**
   * Cidade create
   */
  export type CidadeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * The data needed to create a Cidade.
     */
    data: XOR<CidadeCreateInput, CidadeUncheckedCreateInput>
  }

  /**
   * Cidade createMany
   */
  export type CidadeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cidades.
     */
    data: CidadeCreateManyInput | CidadeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cidade createManyAndReturn
   */
  export type CidadeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * The data used to create many Cidades.
     */
    data: CidadeCreateManyInput | CidadeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cidade update
   */
  export type CidadeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * The data needed to update a Cidade.
     */
    data: XOR<CidadeUpdateInput, CidadeUncheckedUpdateInput>
    /**
     * Choose, which Cidade to update.
     */
    where: CidadeWhereUniqueInput
  }

  /**
   * Cidade updateMany
   */
  export type CidadeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cidades.
     */
    data: XOR<CidadeUpdateManyMutationInput, CidadeUncheckedUpdateManyInput>
    /**
     * Filter which Cidades to update
     */
    where?: CidadeWhereInput
    /**
     * Limit how many Cidades to update.
     */
    limit?: number
  }

  /**
   * Cidade updateManyAndReturn
   */
  export type CidadeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * The data used to update Cidades.
     */
    data: XOR<CidadeUpdateManyMutationInput, CidadeUncheckedUpdateManyInput>
    /**
     * Filter which Cidades to update
     */
    where?: CidadeWhereInput
    /**
     * Limit how many Cidades to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cidade upsert
   */
  export type CidadeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * The filter to search for the Cidade to update in case it exists.
     */
    where: CidadeWhereUniqueInput
    /**
     * In case the Cidade found by the `where` argument doesn't exist, create a new Cidade with this data.
     */
    create: XOR<CidadeCreateInput, CidadeUncheckedCreateInput>
    /**
     * In case the Cidade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CidadeUpdateInput, CidadeUncheckedUpdateInput>
  }

  /**
   * Cidade delete
   */
  export type CidadeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
    /**
     * Filter which Cidade to delete.
     */
    where: CidadeWhereUniqueInput
  }

  /**
   * Cidade deleteMany
   */
  export type CidadeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cidades to delete
     */
    where?: CidadeWhereInput
    /**
     * Limit how many Cidades to delete.
     */
    limit?: number
  }

  /**
   * Cidade.bairros
   */
  export type Cidade$bairrosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    where?: BairroWhereInput
    orderBy?: BairroOrderByWithRelationInput | BairroOrderByWithRelationInput[]
    cursor?: BairroWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BairroScalarFieldEnum | BairroScalarFieldEnum[]
  }

  /**
   * Cidade without action
   */
  export type CidadeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cidade
     */
    select?: CidadeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cidade
     */
    omit?: CidadeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CidadeInclude<ExtArgs> | null
  }


  /**
   * Model Bairro
   */

  export type AggregateBairro = {
    _count: BairroCountAggregateOutputType | null
    _avg: BairroAvgAggregateOutputType | null
    _sum: BairroSumAggregateOutputType | null
    _min: BairroMinAggregateOutputType | null
    _max: BairroMaxAggregateOutputType | null
  }

  export type BairroAvgAggregateOutputType = {
    id: number | null
    cidade_id: number | null
  }

  export type BairroSumAggregateOutputType = {
    id: bigint | null
    cidade_id: number | null
  }

  export type BairroMinAggregateOutputType = {
    id: bigint | null
    nome: string | null
    cidade_id: number | null
  }

  export type BairroMaxAggregateOutputType = {
    id: bigint | null
    nome: string | null
    cidade_id: number | null
  }

  export type BairroCountAggregateOutputType = {
    id: number
    nome: number
    cidade_id: number
    _all: number
  }


  export type BairroAvgAggregateInputType = {
    id?: true
    cidade_id?: true
  }

  export type BairroSumAggregateInputType = {
    id?: true
    cidade_id?: true
  }

  export type BairroMinAggregateInputType = {
    id?: true
    nome?: true
    cidade_id?: true
  }

  export type BairroMaxAggregateInputType = {
    id?: true
    nome?: true
    cidade_id?: true
  }

  export type BairroCountAggregateInputType = {
    id?: true
    nome?: true
    cidade_id?: true
    _all?: true
  }

  export type BairroAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bairro to aggregate.
     */
    where?: BairroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bairros to fetch.
     */
    orderBy?: BairroOrderByWithRelationInput | BairroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BairroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bairros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bairros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bairros
    **/
    _count?: true | BairroCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BairroAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BairroSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BairroMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BairroMaxAggregateInputType
  }

  export type GetBairroAggregateType<T extends BairroAggregateArgs> = {
        [P in keyof T & keyof AggregateBairro]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBairro[P]>
      : GetScalarType<T[P], AggregateBairro[P]>
  }




  export type BairroGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BairroWhereInput
    orderBy?: BairroOrderByWithAggregationInput | BairroOrderByWithAggregationInput[]
    by: BairroScalarFieldEnum[] | BairroScalarFieldEnum
    having?: BairroScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BairroCountAggregateInputType | true
    _avg?: BairroAvgAggregateInputType
    _sum?: BairroSumAggregateInputType
    _min?: BairroMinAggregateInputType
    _max?: BairroMaxAggregateInputType
  }

  export type BairroGroupByOutputType = {
    id: bigint
    nome: string
    cidade_id: number
    _count: BairroCountAggregateOutputType | null
    _avg: BairroAvgAggregateOutputType | null
    _sum: BairroSumAggregateOutputType | null
    _min: BairroMinAggregateOutputType | null
    _max: BairroMaxAggregateOutputType | null
  }

  type GetBairroGroupByPayload<T extends BairroGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BairroGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BairroGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BairroGroupByOutputType[P]>
            : GetScalarType<T[P], BairroGroupByOutputType[P]>
        }
      >
    >


  export type BairroSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cidade_id?: boolean
    cidade?: boolean | CidadeDefaultArgs<ExtArgs>
    logradouro?: boolean | Bairro$logradouroArgs<ExtArgs>
    _count?: boolean | BairroCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bairro"]>

  export type BairroSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cidade_id?: boolean
    cidade?: boolean | CidadeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bairro"]>

  export type BairroSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cidade_id?: boolean
    cidade?: boolean | CidadeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bairro"]>

  export type BairroSelectScalar = {
    id?: boolean
    nome?: boolean
    cidade_id?: boolean
  }

  export type BairroOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "cidade_id", ExtArgs["result"]["bairro"]>
  export type BairroInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cidade?: boolean | CidadeDefaultArgs<ExtArgs>
    logradouro?: boolean | Bairro$logradouroArgs<ExtArgs>
    _count?: boolean | BairroCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BairroIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cidade?: boolean | CidadeDefaultArgs<ExtArgs>
  }
  export type BairroIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cidade?: boolean | CidadeDefaultArgs<ExtArgs>
  }

  export type $BairroPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bairro"
    objects: {
      cidade: Prisma.$CidadePayload<ExtArgs>
      logradouro: Prisma.$LogradouroPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      nome: string
      cidade_id: number
    }, ExtArgs["result"]["bairro"]>
    composites: {}
  }

  type BairroGetPayload<S extends boolean | null | undefined | BairroDefaultArgs> = $Result.GetResult<Prisma.$BairroPayload, S>

  type BairroCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BairroFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BairroCountAggregateInputType | true
    }

  export interface BairroDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bairro'], meta: { name: 'Bairro' } }
    /**
     * Find zero or one Bairro that matches the filter.
     * @param {BairroFindUniqueArgs} args - Arguments to find a Bairro
     * @example
     * // Get one Bairro
     * const bairro = await prisma.bairro.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BairroFindUniqueArgs>(args: SelectSubset<T, BairroFindUniqueArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bairro that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BairroFindUniqueOrThrowArgs} args - Arguments to find a Bairro
     * @example
     * // Get one Bairro
     * const bairro = await prisma.bairro.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BairroFindUniqueOrThrowArgs>(args: SelectSubset<T, BairroFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bairro that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroFindFirstArgs} args - Arguments to find a Bairro
     * @example
     * // Get one Bairro
     * const bairro = await prisma.bairro.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BairroFindFirstArgs>(args?: SelectSubset<T, BairroFindFirstArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bairro that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroFindFirstOrThrowArgs} args - Arguments to find a Bairro
     * @example
     * // Get one Bairro
     * const bairro = await prisma.bairro.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BairroFindFirstOrThrowArgs>(args?: SelectSubset<T, BairroFindFirstOrThrowArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bairros that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bairros
     * const bairros = await prisma.bairro.findMany()
     * 
     * // Get first 10 Bairros
     * const bairros = await prisma.bairro.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bairroWithIdOnly = await prisma.bairro.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BairroFindManyArgs>(args?: SelectSubset<T, BairroFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bairro.
     * @param {BairroCreateArgs} args - Arguments to create a Bairro.
     * @example
     * // Create one Bairro
     * const Bairro = await prisma.bairro.create({
     *   data: {
     *     // ... data to create a Bairro
     *   }
     * })
     * 
     */
    create<T extends BairroCreateArgs>(args: SelectSubset<T, BairroCreateArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bairros.
     * @param {BairroCreateManyArgs} args - Arguments to create many Bairros.
     * @example
     * // Create many Bairros
     * const bairro = await prisma.bairro.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BairroCreateManyArgs>(args?: SelectSubset<T, BairroCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bairros and returns the data saved in the database.
     * @param {BairroCreateManyAndReturnArgs} args - Arguments to create many Bairros.
     * @example
     * // Create many Bairros
     * const bairro = await prisma.bairro.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bairros and only return the `id`
     * const bairroWithIdOnly = await prisma.bairro.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BairroCreateManyAndReturnArgs>(args?: SelectSubset<T, BairroCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bairro.
     * @param {BairroDeleteArgs} args - Arguments to delete one Bairro.
     * @example
     * // Delete one Bairro
     * const Bairro = await prisma.bairro.delete({
     *   where: {
     *     // ... filter to delete one Bairro
     *   }
     * })
     * 
     */
    delete<T extends BairroDeleteArgs>(args: SelectSubset<T, BairroDeleteArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bairro.
     * @param {BairroUpdateArgs} args - Arguments to update one Bairro.
     * @example
     * // Update one Bairro
     * const bairro = await prisma.bairro.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BairroUpdateArgs>(args: SelectSubset<T, BairroUpdateArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bairros.
     * @param {BairroDeleteManyArgs} args - Arguments to filter Bairros to delete.
     * @example
     * // Delete a few Bairros
     * const { count } = await prisma.bairro.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BairroDeleteManyArgs>(args?: SelectSubset<T, BairroDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bairros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bairros
     * const bairro = await prisma.bairro.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BairroUpdateManyArgs>(args: SelectSubset<T, BairroUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bairros and returns the data updated in the database.
     * @param {BairroUpdateManyAndReturnArgs} args - Arguments to update many Bairros.
     * @example
     * // Update many Bairros
     * const bairro = await prisma.bairro.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bairros and only return the `id`
     * const bairroWithIdOnly = await prisma.bairro.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BairroUpdateManyAndReturnArgs>(args: SelectSubset<T, BairroUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bairro.
     * @param {BairroUpsertArgs} args - Arguments to update or create a Bairro.
     * @example
     * // Update or create a Bairro
     * const bairro = await prisma.bairro.upsert({
     *   create: {
     *     // ... data to create a Bairro
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bairro we want to update
     *   }
     * })
     */
    upsert<T extends BairroUpsertArgs>(args: SelectSubset<T, BairroUpsertArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bairros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroCountArgs} args - Arguments to filter Bairros to count.
     * @example
     * // Count the number of Bairros
     * const count = await prisma.bairro.count({
     *   where: {
     *     // ... the filter for the Bairros we want to count
     *   }
     * })
    **/
    count<T extends BairroCountArgs>(
      args?: Subset<T, BairroCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BairroCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bairro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BairroAggregateArgs>(args: Subset<T, BairroAggregateArgs>): Prisma.PrismaPromise<GetBairroAggregateType<T>>

    /**
     * Group by Bairro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BairroGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BairroGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BairroGroupByArgs['orderBy'] }
        : { orderBy?: BairroGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BairroGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBairroGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bairro model
   */
  readonly fields: BairroFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bairro.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BairroClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cidade<T extends CidadeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CidadeDefaultArgs<ExtArgs>>): Prisma__CidadeClient<$Result.GetResult<Prisma.$CidadePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    logradouro<T extends Bairro$logradouroArgs<ExtArgs> = {}>(args?: Subset<T, Bairro$logradouroArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bairro model
   */
  interface BairroFieldRefs {
    readonly id: FieldRef<"Bairro", 'BigInt'>
    readonly nome: FieldRef<"Bairro", 'String'>
    readonly cidade_id: FieldRef<"Bairro", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Bairro findUnique
   */
  export type BairroFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * Filter, which Bairro to fetch.
     */
    where: BairroWhereUniqueInput
  }

  /**
   * Bairro findUniqueOrThrow
   */
  export type BairroFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * Filter, which Bairro to fetch.
     */
    where: BairroWhereUniqueInput
  }

  /**
   * Bairro findFirst
   */
  export type BairroFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * Filter, which Bairro to fetch.
     */
    where?: BairroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bairros to fetch.
     */
    orderBy?: BairroOrderByWithRelationInput | BairroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bairros.
     */
    cursor?: BairroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bairros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bairros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bairros.
     */
    distinct?: BairroScalarFieldEnum | BairroScalarFieldEnum[]
  }

  /**
   * Bairro findFirstOrThrow
   */
  export type BairroFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * Filter, which Bairro to fetch.
     */
    where?: BairroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bairros to fetch.
     */
    orderBy?: BairroOrderByWithRelationInput | BairroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bairros.
     */
    cursor?: BairroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bairros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bairros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bairros.
     */
    distinct?: BairroScalarFieldEnum | BairroScalarFieldEnum[]
  }

  /**
   * Bairro findMany
   */
  export type BairroFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * Filter, which Bairros to fetch.
     */
    where?: BairroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bairros to fetch.
     */
    orderBy?: BairroOrderByWithRelationInput | BairroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bairros.
     */
    cursor?: BairroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bairros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bairros.
     */
    skip?: number
    distinct?: BairroScalarFieldEnum | BairroScalarFieldEnum[]
  }

  /**
   * Bairro create
   */
  export type BairroCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * The data needed to create a Bairro.
     */
    data: XOR<BairroCreateInput, BairroUncheckedCreateInput>
  }

  /**
   * Bairro createMany
   */
  export type BairroCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bairros.
     */
    data: BairroCreateManyInput | BairroCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bairro createManyAndReturn
   */
  export type BairroCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * The data used to create many Bairros.
     */
    data: BairroCreateManyInput | BairroCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bairro update
   */
  export type BairroUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * The data needed to update a Bairro.
     */
    data: XOR<BairroUpdateInput, BairroUncheckedUpdateInput>
    /**
     * Choose, which Bairro to update.
     */
    where: BairroWhereUniqueInput
  }

  /**
   * Bairro updateMany
   */
  export type BairroUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bairros.
     */
    data: XOR<BairroUpdateManyMutationInput, BairroUncheckedUpdateManyInput>
    /**
     * Filter which Bairros to update
     */
    where?: BairroWhereInput
    /**
     * Limit how many Bairros to update.
     */
    limit?: number
  }

  /**
   * Bairro updateManyAndReturn
   */
  export type BairroUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * The data used to update Bairros.
     */
    data: XOR<BairroUpdateManyMutationInput, BairroUncheckedUpdateManyInput>
    /**
     * Filter which Bairros to update
     */
    where?: BairroWhereInput
    /**
     * Limit how many Bairros to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bairro upsert
   */
  export type BairroUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * The filter to search for the Bairro to update in case it exists.
     */
    where: BairroWhereUniqueInput
    /**
     * In case the Bairro found by the `where` argument doesn't exist, create a new Bairro with this data.
     */
    create: XOR<BairroCreateInput, BairroUncheckedCreateInput>
    /**
     * In case the Bairro was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BairroUpdateInput, BairroUncheckedUpdateInput>
  }

  /**
   * Bairro delete
   */
  export type BairroDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
    /**
     * Filter which Bairro to delete.
     */
    where: BairroWhereUniqueInput
  }

  /**
   * Bairro deleteMany
   */
  export type BairroDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bairros to delete
     */
    where?: BairroWhereInput
    /**
     * Limit how many Bairros to delete.
     */
    limit?: number
  }

  /**
   * Bairro.logradouro
   */
  export type Bairro$logradouroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    where?: LogradouroWhereInput
    orderBy?: LogradouroOrderByWithRelationInput | LogradouroOrderByWithRelationInput[]
    cursor?: LogradouroWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LogradouroScalarFieldEnum | LogradouroScalarFieldEnum[]
  }

  /**
   * Bairro without action
   */
  export type BairroDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bairro
     */
    select?: BairroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bairro
     */
    omit?: BairroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BairroInclude<ExtArgs> | null
  }


  /**
   * Model Logradouro
   */

  export type AggregateLogradouro = {
    _count: LogradouroCountAggregateOutputType | null
    _avg: LogradouroAvgAggregateOutputType | null
    _sum: LogradouroSumAggregateOutputType | null
    _min: LogradouroMinAggregateOutputType | null
    _max: LogradouroMaxAggregateOutputType | null
  }

  export type LogradouroAvgAggregateOutputType = {
    id: number | null
    bairro_id: number | null
  }

  export type LogradouroSumAggregateOutputType = {
    id: bigint | null
    bairro_id: bigint | null
  }

  export type LogradouroMinAggregateOutputType = {
    id: bigint | null
    nome: string | null
    cep: string | null
    bairro_id: bigint | null
    tipo: string | null
  }

  export type LogradouroMaxAggregateOutputType = {
    id: bigint | null
    nome: string | null
    cep: string | null
    bairro_id: bigint | null
    tipo: string | null
  }

  export type LogradouroCountAggregateOutputType = {
    id: number
    nome: number
    cep: number
    bairro_id: number
    tipo: number
    _all: number
  }


  export type LogradouroAvgAggregateInputType = {
    id?: true
    bairro_id?: true
  }

  export type LogradouroSumAggregateInputType = {
    id?: true
    bairro_id?: true
  }

  export type LogradouroMinAggregateInputType = {
    id?: true
    nome?: true
    cep?: true
    bairro_id?: true
    tipo?: true
  }

  export type LogradouroMaxAggregateInputType = {
    id?: true
    nome?: true
    cep?: true
    bairro_id?: true
    tipo?: true
  }

  export type LogradouroCountAggregateInputType = {
    id?: true
    nome?: true
    cep?: true
    bairro_id?: true
    tipo?: true
    _all?: true
  }

  export type LogradouroAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Logradouro to aggregate.
     */
    where?: LogradouroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logradouros to fetch.
     */
    orderBy?: LogradouroOrderByWithRelationInput | LogradouroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LogradouroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logradouros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logradouros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Logradouros
    **/
    _count?: true | LogradouroCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LogradouroAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LogradouroSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LogradouroMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LogradouroMaxAggregateInputType
  }

  export type GetLogradouroAggregateType<T extends LogradouroAggregateArgs> = {
        [P in keyof T & keyof AggregateLogradouro]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLogradouro[P]>
      : GetScalarType<T[P], AggregateLogradouro[P]>
  }




  export type LogradouroGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LogradouroWhereInput
    orderBy?: LogradouroOrderByWithAggregationInput | LogradouroOrderByWithAggregationInput[]
    by: LogradouroScalarFieldEnum[] | LogradouroScalarFieldEnum
    having?: LogradouroScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LogradouroCountAggregateInputType | true
    _avg?: LogradouroAvgAggregateInputType
    _sum?: LogradouroSumAggregateInputType
    _min?: LogradouroMinAggregateInputType
    _max?: LogradouroMaxAggregateInputType
  }

  export type LogradouroGroupByOutputType = {
    id: bigint
    nome: string
    cep: string
    bairro_id: bigint
    tipo: string | null
    _count: LogradouroCountAggregateOutputType | null
    _avg: LogradouroAvgAggregateOutputType | null
    _sum: LogradouroSumAggregateOutputType | null
    _min: LogradouroMinAggregateOutputType | null
    _max: LogradouroMaxAggregateOutputType | null
  }

  type GetLogradouroGroupByPayload<T extends LogradouroGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LogradouroGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LogradouroGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LogradouroGroupByOutputType[P]>
            : GetScalarType<T[P], LogradouroGroupByOutputType[P]>
        }
      >
    >


  export type LogradouroSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cep?: boolean
    bairro_id?: boolean
    tipo?: boolean
    bairro?: boolean | BairroDefaultArgs<ExtArgs>
    enderecos?: boolean | Logradouro$enderecosArgs<ExtArgs>
    _count?: boolean | LogradouroCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["logradouro"]>

  export type LogradouroSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cep?: boolean
    bairro_id?: boolean
    tipo?: boolean
    bairro?: boolean | BairroDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["logradouro"]>

  export type LogradouroSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cep?: boolean
    bairro_id?: boolean
    tipo?: boolean
    bairro?: boolean | BairroDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["logradouro"]>

  export type LogradouroSelectScalar = {
    id?: boolean
    nome?: boolean
    cep?: boolean
    bairro_id?: boolean
    tipo?: boolean
  }

  export type LogradouroOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "cep" | "bairro_id" | "tipo", ExtArgs["result"]["logradouro"]>
  export type LogradouroInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bairro?: boolean | BairroDefaultArgs<ExtArgs>
    enderecos?: boolean | Logradouro$enderecosArgs<ExtArgs>
    _count?: boolean | LogradouroCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LogradouroIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bairro?: boolean | BairroDefaultArgs<ExtArgs>
  }
  export type LogradouroIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bairro?: boolean | BairroDefaultArgs<ExtArgs>
  }

  export type $LogradouroPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Logradouro"
    objects: {
      bairro: Prisma.$BairroPayload<ExtArgs>
      enderecos: Prisma.$EnderecoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      nome: string
      cep: string
      bairro_id: bigint
      tipo: string | null
    }, ExtArgs["result"]["logradouro"]>
    composites: {}
  }

  type LogradouroGetPayload<S extends boolean | null | undefined | LogradouroDefaultArgs> = $Result.GetResult<Prisma.$LogradouroPayload, S>

  type LogradouroCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LogradouroFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LogradouroCountAggregateInputType | true
    }

  export interface LogradouroDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Logradouro'], meta: { name: 'Logradouro' } }
    /**
     * Find zero or one Logradouro that matches the filter.
     * @param {LogradouroFindUniqueArgs} args - Arguments to find a Logradouro
     * @example
     * // Get one Logradouro
     * const logradouro = await prisma.logradouro.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LogradouroFindUniqueArgs>(args: SelectSubset<T, LogradouroFindUniqueArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Logradouro that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LogradouroFindUniqueOrThrowArgs} args - Arguments to find a Logradouro
     * @example
     * // Get one Logradouro
     * const logradouro = await prisma.logradouro.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LogradouroFindUniqueOrThrowArgs>(args: SelectSubset<T, LogradouroFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Logradouro that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroFindFirstArgs} args - Arguments to find a Logradouro
     * @example
     * // Get one Logradouro
     * const logradouro = await prisma.logradouro.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LogradouroFindFirstArgs>(args?: SelectSubset<T, LogradouroFindFirstArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Logradouro that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroFindFirstOrThrowArgs} args - Arguments to find a Logradouro
     * @example
     * // Get one Logradouro
     * const logradouro = await prisma.logradouro.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LogradouroFindFirstOrThrowArgs>(args?: SelectSubset<T, LogradouroFindFirstOrThrowArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Logradouros that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Logradouros
     * const logradouros = await prisma.logradouro.findMany()
     * 
     * // Get first 10 Logradouros
     * const logradouros = await prisma.logradouro.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const logradouroWithIdOnly = await prisma.logradouro.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LogradouroFindManyArgs>(args?: SelectSubset<T, LogradouroFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Logradouro.
     * @param {LogradouroCreateArgs} args - Arguments to create a Logradouro.
     * @example
     * // Create one Logradouro
     * const Logradouro = await prisma.logradouro.create({
     *   data: {
     *     // ... data to create a Logradouro
     *   }
     * })
     * 
     */
    create<T extends LogradouroCreateArgs>(args: SelectSubset<T, LogradouroCreateArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Logradouros.
     * @param {LogradouroCreateManyArgs} args - Arguments to create many Logradouros.
     * @example
     * // Create many Logradouros
     * const logradouro = await prisma.logradouro.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LogradouroCreateManyArgs>(args?: SelectSubset<T, LogradouroCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Logradouros and returns the data saved in the database.
     * @param {LogradouroCreateManyAndReturnArgs} args - Arguments to create many Logradouros.
     * @example
     * // Create many Logradouros
     * const logradouro = await prisma.logradouro.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Logradouros and only return the `id`
     * const logradouroWithIdOnly = await prisma.logradouro.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LogradouroCreateManyAndReturnArgs>(args?: SelectSubset<T, LogradouroCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Logradouro.
     * @param {LogradouroDeleteArgs} args - Arguments to delete one Logradouro.
     * @example
     * // Delete one Logradouro
     * const Logradouro = await prisma.logradouro.delete({
     *   where: {
     *     // ... filter to delete one Logradouro
     *   }
     * })
     * 
     */
    delete<T extends LogradouroDeleteArgs>(args: SelectSubset<T, LogradouroDeleteArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Logradouro.
     * @param {LogradouroUpdateArgs} args - Arguments to update one Logradouro.
     * @example
     * // Update one Logradouro
     * const logradouro = await prisma.logradouro.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LogradouroUpdateArgs>(args: SelectSubset<T, LogradouroUpdateArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Logradouros.
     * @param {LogradouroDeleteManyArgs} args - Arguments to filter Logradouros to delete.
     * @example
     * // Delete a few Logradouros
     * const { count } = await prisma.logradouro.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LogradouroDeleteManyArgs>(args?: SelectSubset<T, LogradouroDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Logradouros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Logradouros
     * const logradouro = await prisma.logradouro.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LogradouroUpdateManyArgs>(args: SelectSubset<T, LogradouroUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Logradouros and returns the data updated in the database.
     * @param {LogradouroUpdateManyAndReturnArgs} args - Arguments to update many Logradouros.
     * @example
     * // Update many Logradouros
     * const logradouro = await prisma.logradouro.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Logradouros and only return the `id`
     * const logradouroWithIdOnly = await prisma.logradouro.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LogradouroUpdateManyAndReturnArgs>(args: SelectSubset<T, LogradouroUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Logradouro.
     * @param {LogradouroUpsertArgs} args - Arguments to update or create a Logradouro.
     * @example
     * // Update or create a Logradouro
     * const logradouro = await prisma.logradouro.upsert({
     *   create: {
     *     // ... data to create a Logradouro
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Logradouro we want to update
     *   }
     * })
     */
    upsert<T extends LogradouroUpsertArgs>(args: SelectSubset<T, LogradouroUpsertArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Logradouros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroCountArgs} args - Arguments to filter Logradouros to count.
     * @example
     * // Count the number of Logradouros
     * const count = await prisma.logradouro.count({
     *   where: {
     *     // ... the filter for the Logradouros we want to count
     *   }
     * })
    **/
    count<T extends LogradouroCountArgs>(
      args?: Subset<T, LogradouroCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LogradouroCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Logradouro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LogradouroAggregateArgs>(args: Subset<T, LogradouroAggregateArgs>): Prisma.PrismaPromise<GetLogradouroAggregateType<T>>

    /**
     * Group by Logradouro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogradouroGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LogradouroGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LogradouroGroupByArgs['orderBy'] }
        : { orderBy?: LogradouroGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LogradouroGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLogradouroGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Logradouro model
   */
  readonly fields: LogradouroFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Logradouro.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LogradouroClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bairro<T extends BairroDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BairroDefaultArgs<ExtArgs>>): Prisma__BairroClient<$Result.GetResult<Prisma.$BairroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    enderecos<T extends Logradouro$enderecosArgs<ExtArgs> = {}>(args?: Subset<T, Logradouro$enderecosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Logradouro model
   */
  interface LogradouroFieldRefs {
    readonly id: FieldRef<"Logradouro", 'BigInt'>
    readonly nome: FieldRef<"Logradouro", 'String'>
    readonly cep: FieldRef<"Logradouro", 'String'>
    readonly bairro_id: FieldRef<"Logradouro", 'BigInt'>
    readonly tipo: FieldRef<"Logradouro", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Logradouro findUnique
   */
  export type LogradouroFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * Filter, which Logradouro to fetch.
     */
    where: LogradouroWhereUniqueInput
  }

  /**
   * Logradouro findUniqueOrThrow
   */
  export type LogradouroFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * Filter, which Logradouro to fetch.
     */
    where: LogradouroWhereUniqueInput
  }

  /**
   * Logradouro findFirst
   */
  export type LogradouroFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * Filter, which Logradouro to fetch.
     */
    where?: LogradouroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logradouros to fetch.
     */
    orderBy?: LogradouroOrderByWithRelationInput | LogradouroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Logradouros.
     */
    cursor?: LogradouroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logradouros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logradouros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Logradouros.
     */
    distinct?: LogradouroScalarFieldEnum | LogradouroScalarFieldEnum[]
  }

  /**
   * Logradouro findFirstOrThrow
   */
  export type LogradouroFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * Filter, which Logradouro to fetch.
     */
    where?: LogradouroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logradouros to fetch.
     */
    orderBy?: LogradouroOrderByWithRelationInput | LogradouroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Logradouros.
     */
    cursor?: LogradouroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logradouros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logradouros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Logradouros.
     */
    distinct?: LogradouroScalarFieldEnum | LogradouroScalarFieldEnum[]
  }

  /**
   * Logradouro findMany
   */
  export type LogradouroFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * Filter, which Logradouros to fetch.
     */
    where?: LogradouroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logradouros to fetch.
     */
    orderBy?: LogradouroOrderByWithRelationInput | LogradouroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Logradouros.
     */
    cursor?: LogradouroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logradouros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logradouros.
     */
    skip?: number
    distinct?: LogradouroScalarFieldEnum | LogradouroScalarFieldEnum[]
  }

  /**
   * Logradouro create
   */
  export type LogradouroCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * The data needed to create a Logradouro.
     */
    data: XOR<LogradouroCreateInput, LogradouroUncheckedCreateInput>
  }

  /**
   * Logradouro createMany
   */
  export type LogradouroCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Logradouros.
     */
    data: LogradouroCreateManyInput | LogradouroCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Logradouro createManyAndReturn
   */
  export type LogradouroCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * The data used to create many Logradouros.
     */
    data: LogradouroCreateManyInput | LogradouroCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Logradouro update
   */
  export type LogradouroUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * The data needed to update a Logradouro.
     */
    data: XOR<LogradouroUpdateInput, LogradouroUncheckedUpdateInput>
    /**
     * Choose, which Logradouro to update.
     */
    where: LogradouroWhereUniqueInput
  }

  /**
   * Logradouro updateMany
   */
  export type LogradouroUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Logradouros.
     */
    data: XOR<LogradouroUpdateManyMutationInput, LogradouroUncheckedUpdateManyInput>
    /**
     * Filter which Logradouros to update
     */
    where?: LogradouroWhereInput
    /**
     * Limit how many Logradouros to update.
     */
    limit?: number
  }

  /**
   * Logradouro updateManyAndReturn
   */
  export type LogradouroUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * The data used to update Logradouros.
     */
    data: XOR<LogradouroUpdateManyMutationInput, LogradouroUncheckedUpdateManyInput>
    /**
     * Filter which Logradouros to update
     */
    where?: LogradouroWhereInput
    /**
     * Limit how many Logradouros to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Logradouro upsert
   */
  export type LogradouroUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * The filter to search for the Logradouro to update in case it exists.
     */
    where: LogradouroWhereUniqueInput
    /**
     * In case the Logradouro found by the `where` argument doesn't exist, create a new Logradouro with this data.
     */
    create: XOR<LogradouroCreateInput, LogradouroUncheckedCreateInput>
    /**
     * In case the Logradouro was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LogradouroUpdateInput, LogradouroUncheckedUpdateInput>
  }

  /**
   * Logradouro delete
   */
  export type LogradouroDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
    /**
     * Filter which Logradouro to delete.
     */
    where: LogradouroWhereUniqueInput
  }

  /**
   * Logradouro deleteMany
   */
  export type LogradouroDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Logradouros to delete
     */
    where?: LogradouroWhereInput
    /**
     * Limit how many Logradouros to delete.
     */
    limit?: number
  }

  /**
   * Logradouro.enderecos
   */
  export type Logradouro$enderecosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    where?: EnderecoWhereInput
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    cursor?: EnderecoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Logradouro without action
   */
  export type LogradouroDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Logradouro
     */
    select?: LogradouroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Logradouro
     */
    omit?: LogradouroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogradouroInclude<ExtArgs> | null
  }


  /**
   * Model Pessoa
   */

  export type AggregatePessoa = {
    _count: PessoaCountAggregateOutputType | null
    _min: PessoaMinAggregateOutputType | null
    _max: PessoaMaxAggregateOutputType | null
  }

  export type PessoaMinAggregateOutputType = {
    id: string | null
    cpf: string | null
    nascimento: Date | null
    celular: string | null
    criado_em: Date | null
    atualizado_em: Date | null
  }

  export type PessoaMaxAggregateOutputType = {
    id: string | null
    cpf: string | null
    nascimento: Date | null
    celular: string | null
    criado_em: Date | null
    atualizado_em: Date | null
  }

  export type PessoaCountAggregateOutputType = {
    id: number
    cpf: number
    nascimento: number
    celular: number
    criado_em: number
    atualizado_em: number
    _all: number
  }


  export type PessoaMinAggregateInputType = {
    id?: true
    cpf?: true
    nascimento?: true
    celular?: true
    criado_em?: true
    atualizado_em?: true
  }

  export type PessoaMaxAggregateInputType = {
    id?: true
    cpf?: true
    nascimento?: true
    celular?: true
    criado_em?: true
    atualizado_em?: true
  }

  export type PessoaCountAggregateInputType = {
    id?: true
    cpf?: true
    nascimento?: true
    celular?: true
    criado_em?: true
    atualizado_em?: true
    _all?: true
  }

  export type PessoaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pessoa to aggregate.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pessoas
    **/
    _count?: true | PessoaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PessoaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PessoaMaxAggregateInputType
  }

  export type GetPessoaAggregateType<T extends PessoaAggregateArgs> = {
        [P in keyof T & keyof AggregatePessoa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePessoa[P]>
      : GetScalarType<T[P], AggregatePessoa[P]>
  }




  export type PessoaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PessoaWhereInput
    orderBy?: PessoaOrderByWithAggregationInput | PessoaOrderByWithAggregationInput[]
    by: PessoaScalarFieldEnum[] | PessoaScalarFieldEnum
    having?: PessoaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PessoaCountAggregateInputType | true
    _min?: PessoaMinAggregateInputType
    _max?: PessoaMaxAggregateInputType
  }

  export type PessoaGroupByOutputType = {
    id: string
    cpf: string
    nascimento: Date
    celular: string
    criado_em: Date
    atualizado_em: Date
    _count: PessoaCountAggregateOutputType | null
    _min: PessoaMinAggregateOutputType | null
    _max: PessoaMaxAggregateOutputType | null
  }

  type GetPessoaGroupByPayload<T extends PessoaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PessoaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PessoaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PessoaGroupByOutputType[P]>
            : GetScalarType<T[P], PessoaGroupByOutputType[P]>
        }
      >
    >


  export type PessoaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cpf?: boolean
    nascimento?: boolean
    celular?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    enderecos?: boolean | Pessoa$enderecosArgs<ExtArgs>
    profissional?: boolean | Pessoa$profissionalArgs<ExtArgs>
    servico_cliente?: boolean | Pessoa$servico_clienteArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | PessoaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pessoa"]>

  export type PessoaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cpf?: boolean
    nascimento?: boolean
    celular?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pessoa"]>

  export type PessoaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cpf?: boolean
    nascimento?: boolean
    celular?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pessoa"]>

  export type PessoaSelectScalar = {
    id?: boolean
    cpf?: boolean
    nascimento?: boolean
    celular?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
  }

  export type PessoaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cpf" | "nascimento" | "celular" | "criado_em" | "atualizado_em", ExtArgs["result"]["pessoa"]>
  export type PessoaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enderecos?: boolean | Pessoa$enderecosArgs<ExtArgs>
    profissional?: boolean | Pessoa$profissionalArgs<ExtArgs>
    servico_cliente?: boolean | Pessoa$servico_clienteArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | PessoaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PessoaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PessoaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PessoaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pessoa"
    objects: {
      enderecos: Prisma.$EnderecoPayload<ExtArgs>[]
      profissional: Prisma.$ProfissionalPayload<ExtArgs> | null
      servico_cliente: Prisma.$servico_clientePayload<ExtArgs>[]
      usuario: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cpf: string
      nascimento: Date
      celular: string
      criado_em: Date
      atualizado_em: Date
    }, ExtArgs["result"]["pessoa"]>
    composites: {}
  }

  type PessoaGetPayload<S extends boolean | null | undefined | PessoaDefaultArgs> = $Result.GetResult<Prisma.$PessoaPayload, S>

  type PessoaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PessoaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PessoaCountAggregateInputType | true
    }

  export interface PessoaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pessoa'], meta: { name: 'Pessoa' } }
    /**
     * Find zero or one Pessoa that matches the filter.
     * @param {PessoaFindUniqueArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PessoaFindUniqueArgs>(args: SelectSubset<T, PessoaFindUniqueArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pessoa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PessoaFindUniqueOrThrowArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PessoaFindUniqueOrThrowArgs>(args: SelectSubset<T, PessoaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pessoa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaFindFirstArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PessoaFindFirstArgs>(args?: SelectSubset<T, PessoaFindFirstArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pessoa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaFindFirstOrThrowArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PessoaFindFirstOrThrowArgs>(args?: SelectSubset<T, PessoaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pessoas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pessoas
     * const pessoas = await prisma.pessoa.findMany()
     * 
     * // Get first 10 Pessoas
     * const pessoas = await prisma.pessoa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pessoaWithIdOnly = await prisma.pessoa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PessoaFindManyArgs>(args?: SelectSubset<T, PessoaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pessoa.
     * @param {PessoaCreateArgs} args - Arguments to create a Pessoa.
     * @example
     * // Create one Pessoa
     * const Pessoa = await prisma.pessoa.create({
     *   data: {
     *     // ... data to create a Pessoa
     *   }
     * })
     * 
     */
    create<T extends PessoaCreateArgs>(args: SelectSubset<T, PessoaCreateArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pessoas.
     * @param {PessoaCreateManyArgs} args - Arguments to create many Pessoas.
     * @example
     * // Create many Pessoas
     * const pessoa = await prisma.pessoa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PessoaCreateManyArgs>(args?: SelectSubset<T, PessoaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pessoas and returns the data saved in the database.
     * @param {PessoaCreateManyAndReturnArgs} args - Arguments to create many Pessoas.
     * @example
     * // Create many Pessoas
     * const pessoa = await prisma.pessoa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pessoas and only return the `id`
     * const pessoaWithIdOnly = await prisma.pessoa.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PessoaCreateManyAndReturnArgs>(args?: SelectSubset<T, PessoaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pessoa.
     * @param {PessoaDeleteArgs} args - Arguments to delete one Pessoa.
     * @example
     * // Delete one Pessoa
     * const Pessoa = await prisma.pessoa.delete({
     *   where: {
     *     // ... filter to delete one Pessoa
     *   }
     * })
     * 
     */
    delete<T extends PessoaDeleteArgs>(args: SelectSubset<T, PessoaDeleteArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pessoa.
     * @param {PessoaUpdateArgs} args - Arguments to update one Pessoa.
     * @example
     * // Update one Pessoa
     * const pessoa = await prisma.pessoa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PessoaUpdateArgs>(args: SelectSubset<T, PessoaUpdateArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pessoas.
     * @param {PessoaDeleteManyArgs} args - Arguments to filter Pessoas to delete.
     * @example
     * // Delete a few Pessoas
     * const { count } = await prisma.pessoa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PessoaDeleteManyArgs>(args?: SelectSubset<T, PessoaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pessoas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pessoas
     * const pessoa = await prisma.pessoa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PessoaUpdateManyArgs>(args: SelectSubset<T, PessoaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pessoas and returns the data updated in the database.
     * @param {PessoaUpdateManyAndReturnArgs} args - Arguments to update many Pessoas.
     * @example
     * // Update many Pessoas
     * const pessoa = await prisma.pessoa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pessoas and only return the `id`
     * const pessoaWithIdOnly = await prisma.pessoa.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PessoaUpdateManyAndReturnArgs>(args: SelectSubset<T, PessoaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pessoa.
     * @param {PessoaUpsertArgs} args - Arguments to update or create a Pessoa.
     * @example
     * // Update or create a Pessoa
     * const pessoa = await prisma.pessoa.upsert({
     *   create: {
     *     // ... data to create a Pessoa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pessoa we want to update
     *   }
     * })
     */
    upsert<T extends PessoaUpsertArgs>(args: SelectSubset<T, PessoaUpsertArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pessoas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaCountArgs} args - Arguments to filter Pessoas to count.
     * @example
     * // Count the number of Pessoas
     * const count = await prisma.pessoa.count({
     *   where: {
     *     // ... the filter for the Pessoas we want to count
     *   }
     * })
    **/
    count<T extends PessoaCountArgs>(
      args?: Subset<T, PessoaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PessoaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pessoa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PessoaAggregateArgs>(args: Subset<T, PessoaAggregateArgs>): Prisma.PrismaPromise<GetPessoaAggregateType<T>>

    /**
     * Group by Pessoa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PessoaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PessoaGroupByArgs['orderBy'] }
        : { orderBy?: PessoaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PessoaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPessoaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pessoa model
   */
  readonly fields: PessoaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pessoa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PessoaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enderecos<T extends Pessoa$enderecosArgs<ExtArgs> = {}>(args?: Subset<T, Pessoa$enderecosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profissional<T extends Pessoa$profissionalArgs<ExtArgs> = {}>(args?: Subset<T, Pessoa$profissionalArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    servico_cliente<T extends Pessoa$servico_clienteArgs<ExtArgs> = {}>(args?: Subset<T, Pessoa$servico_clienteArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    usuario<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pessoa model
   */
  interface PessoaFieldRefs {
    readonly id: FieldRef<"Pessoa", 'String'>
    readonly cpf: FieldRef<"Pessoa", 'String'>
    readonly nascimento: FieldRef<"Pessoa", 'DateTime'>
    readonly celular: FieldRef<"Pessoa", 'String'>
    readonly criado_em: FieldRef<"Pessoa", 'DateTime'>
    readonly atualizado_em: FieldRef<"Pessoa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pessoa findUnique
   */
  export type PessoaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa findUniqueOrThrow
   */
  export type PessoaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa findFirst
   */
  export type PessoaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pessoas.
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pessoas.
     */
    distinct?: PessoaScalarFieldEnum | PessoaScalarFieldEnum[]
  }

  /**
   * Pessoa findFirstOrThrow
   */
  export type PessoaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pessoas.
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pessoas.
     */
    distinct?: PessoaScalarFieldEnum | PessoaScalarFieldEnum[]
  }

  /**
   * Pessoa findMany
   */
  export type PessoaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoas to fetch.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pessoas.
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    distinct?: PessoaScalarFieldEnum | PessoaScalarFieldEnum[]
  }

  /**
   * Pessoa create
   */
  export type PessoaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * The data needed to create a Pessoa.
     */
    data: XOR<PessoaCreateInput, PessoaUncheckedCreateInput>
  }

  /**
   * Pessoa createMany
   */
  export type PessoaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pessoas.
     */
    data: PessoaCreateManyInput | PessoaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pessoa createManyAndReturn
   */
  export type PessoaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * The data used to create many Pessoas.
     */
    data: PessoaCreateManyInput | PessoaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pessoa update
   */
  export type PessoaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * The data needed to update a Pessoa.
     */
    data: XOR<PessoaUpdateInput, PessoaUncheckedUpdateInput>
    /**
     * Choose, which Pessoa to update.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa updateMany
   */
  export type PessoaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pessoas.
     */
    data: XOR<PessoaUpdateManyMutationInput, PessoaUncheckedUpdateManyInput>
    /**
     * Filter which Pessoas to update
     */
    where?: PessoaWhereInput
    /**
     * Limit how many Pessoas to update.
     */
    limit?: number
  }

  /**
   * Pessoa updateManyAndReturn
   */
  export type PessoaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * The data used to update Pessoas.
     */
    data: XOR<PessoaUpdateManyMutationInput, PessoaUncheckedUpdateManyInput>
    /**
     * Filter which Pessoas to update
     */
    where?: PessoaWhereInput
    /**
     * Limit how many Pessoas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pessoa upsert
   */
  export type PessoaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * The filter to search for the Pessoa to update in case it exists.
     */
    where: PessoaWhereUniqueInput
    /**
     * In case the Pessoa found by the `where` argument doesn't exist, create a new Pessoa with this data.
     */
    create: XOR<PessoaCreateInput, PessoaUncheckedCreateInput>
    /**
     * In case the Pessoa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PessoaUpdateInput, PessoaUncheckedUpdateInput>
  }

  /**
   * Pessoa delete
   */
  export type PessoaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter which Pessoa to delete.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa deleteMany
   */
  export type PessoaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pessoas to delete
     */
    where?: PessoaWhereInput
    /**
     * Limit how many Pessoas to delete.
     */
    limit?: number
  }

  /**
   * Pessoa.enderecos
   */
  export type Pessoa$enderecosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    where?: EnderecoWhereInput
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    cursor?: EnderecoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Pessoa.profissional
   */
  export type Pessoa$profissionalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    where?: ProfissionalWhereInput
  }

  /**
   * Pessoa.servico_cliente
   */
  export type Pessoa$servico_clienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    where?: servico_clienteWhereInput
    orderBy?: servico_clienteOrderByWithRelationInput | servico_clienteOrderByWithRelationInput[]
    cursor?: servico_clienteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Servico_clienteScalarFieldEnum | Servico_clienteScalarFieldEnum[]
  }

  /**
   * Pessoa without action
   */
  export type PessoaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
  }


  /**
   * Model Endereco
   */

  export type AggregateEndereco = {
    _count: EnderecoCountAggregateOutputType | null
    _avg: EnderecoAvgAggregateOutputType | null
    _sum: EnderecoSumAggregateOutputType | null
    _min: EnderecoMinAggregateOutputType | null
    _max: EnderecoMaxAggregateOutputType | null
  }

  export type EnderecoAvgAggregateOutputType = {
    logradouro_id: number | null
  }

  export type EnderecoSumAggregateOutputType = {
    logradouro_id: bigint | null
  }

  export type EnderecoMinAggregateOutputType = {
    logradouro_id: bigint | null
    pessoa_id: string | null
    numero: string | null
    complemento: string | null
    referencia: string | null
  }

  export type EnderecoMaxAggregateOutputType = {
    logradouro_id: bigint | null
    pessoa_id: string | null
    numero: string | null
    complemento: string | null
    referencia: string | null
  }

  export type EnderecoCountAggregateOutputType = {
    logradouro_id: number
    pessoa_id: number
    numero: number
    complemento: number
    referencia: number
    _all: number
  }


  export type EnderecoAvgAggregateInputType = {
    logradouro_id?: true
  }

  export type EnderecoSumAggregateInputType = {
    logradouro_id?: true
  }

  export type EnderecoMinAggregateInputType = {
    logradouro_id?: true
    pessoa_id?: true
    numero?: true
    complemento?: true
    referencia?: true
  }

  export type EnderecoMaxAggregateInputType = {
    logradouro_id?: true
    pessoa_id?: true
    numero?: true
    complemento?: true
    referencia?: true
  }

  export type EnderecoCountAggregateInputType = {
    logradouro_id?: true
    pessoa_id?: true
    numero?: true
    complemento?: true
    referencia?: true
    _all?: true
  }

  export type EnderecoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Endereco to aggregate.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Enderecos
    **/
    _count?: true | EnderecoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EnderecoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EnderecoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnderecoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnderecoMaxAggregateInputType
  }

  export type GetEnderecoAggregateType<T extends EnderecoAggregateArgs> = {
        [P in keyof T & keyof AggregateEndereco]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEndereco[P]>
      : GetScalarType<T[P], AggregateEndereco[P]>
  }




  export type EnderecoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnderecoWhereInput
    orderBy?: EnderecoOrderByWithAggregationInput | EnderecoOrderByWithAggregationInput[]
    by: EnderecoScalarFieldEnum[] | EnderecoScalarFieldEnum
    having?: EnderecoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnderecoCountAggregateInputType | true
    _avg?: EnderecoAvgAggregateInputType
    _sum?: EnderecoSumAggregateInputType
    _min?: EnderecoMinAggregateInputType
    _max?: EnderecoMaxAggregateInputType
  }

  export type EnderecoGroupByOutputType = {
    logradouro_id: bigint
    pessoa_id: string
    numero: string
    complemento: string | null
    referencia: string | null
    _count: EnderecoCountAggregateOutputType | null
    _avg: EnderecoAvgAggregateOutputType | null
    _sum: EnderecoSumAggregateOutputType | null
    _min: EnderecoMinAggregateOutputType | null
    _max: EnderecoMaxAggregateOutputType | null
  }

  type GetEnderecoGroupByPayload<T extends EnderecoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnderecoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnderecoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnderecoGroupByOutputType[P]>
            : GetScalarType<T[P], EnderecoGroupByOutputType[P]>
        }
      >
    >


  export type EnderecoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    logradouro_id?: boolean
    pessoa_id?: boolean
    numero?: boolean
    complemento?: boolean
    referencia?: boolean
    logradouro?: boolean | LogradouroDefaultArgs<ExtArgs>
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["endereco"]>

  export type EnderecoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    logradouro_id?: boolean
    pessoa_id?: boolean
    numero?: boolean
    complemento?: boolean
    referencia?: boolean
    logradouro?: boolean | LogradouroDefaultArgs<ExtArgs>
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["endereco"]>

  export type EnderecoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    logradouro_id?: boolean
    pessoa_id?: boolean
    numero?: boolean
    complemento?: boolean
    referencia?: boolean
    logradouro?: boolean | LogradouroDefaultArgs<ExtArgs>
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["endereco"]>

  export type EnderecoSelectScalar = {
    logradouro_id?: boolean
    pessoa_id?: boolean
    numero?: boolean
    complemento?: boolean
    referencia?: boolean
  }

  export type EnderecoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"logradouro_id" | "pessoa_id" | "numero" | "complemento" | "referencia", ExtArgs["result"]["endereco"]>
  export type EnderecoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logradouro?: boolean | LogradouroDefaultArgs<ExtArgs>
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }
  export type EnderecoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logradouro?: boolean | LogradouroDefaultArgs<ExtArgs>
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }
  export type EnderecoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logradouro?: boolean | LogradouroDefaultArgs<ExtArgs>
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }

  export type $EnderecoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Endereco"
    objects: {
      logradouro: Prisma.$LogradouroPayload<ExtArgs>
      pessoa: Prisma.$PessoaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      logradouro_id: bigint
      pessoa_id: string
      numero: string
      complemento: string | null
      referencia: string | null
    }, ExtArgs["result"]["endereco"]>
    composites: {}
  }

  type EnderecoGetPayload<S extends boolean | null | undefined | EnderecoDefaultArgs> = $Result.GetResult<Prisma.$EnderecoPayload, S>

  type EnderecoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnderecoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnderecoCountAggregateInputType | true
    }

  export interface EnderecoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Endereco'], meta: { name: 'Endereco' } }
    /**
     * Find zero or one Endereco that matches the filter.
     * @param {EnderecoFindUniqueArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnderecoFindUniqueArgs>(args: SelectSubset<T, EnderecoFindUniqueArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Endereco that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnderecoFindUniqueOrThrowArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnderecoFindUniqueOrThrowArgs>(args: SelectSubset<T, EnderecoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Endereco that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoFindFirstArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnderecoFindFirstArgs>(args?: SelectSubset<T, EnderecoFindFirstArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Endereco that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoFindFirstOrThrowArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnderecoFindFirstOrThrowArgs>(args?: SelectSubset<T, EnderecoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Enderecos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Enderecos
     * const enderecos = await prisma.endereco.findMany()
     * 
     * // Get first 10 Enderecos
     * const enderecos = await prisma.endereco.findMany({ take: 10 })
     * 
     * // Only select the `logradouro_id`
     * const enderecoWithLogradouro_idOnly = await prisma.endereco.findMany({ select: { logradouro_id: true } })
     * 
     */
    findMany<T extends EnderecoFindManyArgs>(args?: SelectSubset<T, EnderecoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Endereco.
     * @param {EnderecoCreateArgs} args - Arguments to create a Endereco.
     * @example
     * // Create one Endereco
     * const Endereco = await prisma.endereco.create({
     *   data: {
     *     // ... data to create a Endereco
     *   }
     * })
     * 
     */
    create<T extends EnderecoCreateArgs>(args: SelectSubset<T, EnderecoCreateArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Enderecos.
     * @param {EnderecoCreateManyArgs} args - Arguments to create many Enderecos.
     * @example
     * // Create many Enderecos
     * const endereco = await prisma.endereco.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnderecoCreateManyArgs>(args?: SelectSubset<T, EnderecoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Enderecos and returns the data saved in the database.
     * @param {EnderecoCreateManyAndReturnArgs} args - Arguments to create many Enderecos.
     * @example
     * // Create many Enderecos
     * const endereco = await prisma.endereco.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Enderecos and only return the `logradouro_id`
     * const enderecoWithLogradouro_idOnly = await prisma.endereco.createManyAndReturn({
     *   select: { logradouro_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnderecoCreateManyAndReturnArgs>(args?: SelectSubset<T, EnderecoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Endereco.
     * @param {EnderecoDeleteArgs} args - Arguments to delete one Endereco.
     * @example
     * // Delete one Endereco
     * const Endereco = await prisma.endereco.delete({
     *   where: {
     *     // ... filter to delete one Endereco
     *   }
     * })
     * 
     */
    delete<T extends EnderecoDeleteArgs>(args: SelectSubset<T, EnderecoDeleteArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Endereco.
     * @param {EnderecoUpdateArgs} args - Arguments to update one Endereco.
     * @example
     * // Update one Endereco
     * const endereco = await prisma.endereco.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnderecoUpdateArgs>(args: SelectSubset<T, EnderecoUpdateArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Enderecos.
     * @param {EnderecoDeleteManyArgs} args - Arguments to filter Enderecos to delete.
     * @example
     * // Delete a few Enderecos
     * const { count } = await prisma.endereco.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnderecoDeleteManyArgs>(args?: SelectSubset<T, EnderecoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enderecos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Enderecos
     * const endereco = await prisma.endereco.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnderecoUpdateManyArgs>(args: SelectSubset<T, EnderecoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enderecos and returns the data updated in the database.
     * @param {EnderecoUpdateManyAndReturnArgs} args - Arguments to update many Enderecos.
     * @example
     * // Update many Enderecos
     * const endereco = await prisma.endereco.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Enderecos and only return the `logradouro_id`
     * const enderecoWithLogradouro_idOnly = await prisma.endereco.updateManyAndReturn({
     *   select: { logradouro_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EnderecoUpdateManyAndReturnArgs>(args: SelectSubset<T, EnderecoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Endereco.
     * @param {EnderecoUpsertArgs} args - Arguments to update or create a Endereco.
     * @example
     * // Update or create a Endereco
     * const endereco = await prisma.endereco.upsert({
     *   create: {
     *     // ... data to create a Endereco
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Endereco we want to update
     *   }
     * })
     */
    upsert<T extends EnderecoUpsertArgs>(args: SelectSubset<T, EnderecoUpsertArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Enderecos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoCountArgs} args - Arguments to filter Enderecos to count.
     * @example
     * // Count the number of Enderecos
     * const count = await prisma.endereco.count({
     *   where: {
     *     // ... the filter for the Enderecos we want to count
     *   }
     * })
    **/
    count<T extends EnderecoCountArgs>(
      args?: Subset<T, EnderecoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnderecoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Endereco.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnderecoAggregateArgs>(args: Subset<T, EnderecoAggregateArgs>): Prisma.PrismaPromise<GetEnderecoAggregateType<T>>

    /**
     * Group by Endereco.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnderecoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnderecoGroupByArgs['orderBy'] }
        : { orderBy?: EnderecoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnderecoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnderecoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Endereco model
   */
  readonly fields: EnderecoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Endereco.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnderecoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    logradouro<T extends LogradouroDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LogradouroDefaultArgs<ExtArgs>>): Prisma__LogradouroClient<$Result.GetResult<Prisma.$LogradouroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pessoa<T extends PessoaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PessoaDefaultArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Endereco model
   */
  interface EnderecoFieldRefs {
    readonly logradouro_id: FieldRef<"Endereco", 'BigInt'>
    readonly pessoa_id: FieldRef<"Endereco", 'String'>
    readonly numero: FieldRef<"Endereco", 'String'>
    readonly complemento: FieldRef<"Endereco", 'String'>
    readonly referencia: FieldRef<"Endereco", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Endereco findUnique
   */
  export type EnderecoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco findUniqueOrThrow
   */
  export type EnderecoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco findFirst
   */
  export type EnderecoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enderecos.
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enderecos.
     */
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Endereco findFirstOrThrow
   */
  export type EnderecoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enderecos.
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enderecos.
     */
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Endereco findMany
   */
  export type EnderecoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Enderecos to fetch.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Enderecos.
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Endereco create
   */
  export type EnderecoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * The data needed to create a Endereco.
     */
    data: XOR<EnderecoCreateInput, EnderecoUncheckedCreateInput>
  }

  /**
   * Endereco createMany
   */
  export type EnderecoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Enderecos.
     */
    data: EnderecoCreateManyInput | EnderecoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Endereco createManyAndReturn
   */
  export type EnderecoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * The data used to create many Enderecos.
     */
    data: EnderecoCreateManyInput | EnderecoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Endereco update
   */
  export type EnderecoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * The data needed to update a Endereco.
     */
    data: XOR<EnderecoUpdateInput, EnderecoUncheckedUpdateInput>
    /**
     * Choose, which Endereco to update.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco updateMany
   */
  export type EnderecoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Enderecos.
     */
    data: XOR<EnderecoUpdateManyMutationInput, EnderecoUncheckedUpdateManyInput>
    /**
     * Filter which Enderecos to update
     */
    where?: EnderecoWhereInput
    /**
     * Limit how many Enderecos to update.
     */
    limit?: number
  }

  /**
   * Endereco updateManyAndReturn
   */
  export type EnderecoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * The data used to update Enderecos.
     */
    data: XOR<EnderecoUpdateManyMutationInput, EnderecoUncheckedUpdateManyInput>
    /**
     * Filter which Enderecos to update
     */
    where?: EnderecoWhereInput
    /**
     * Limit how many Enderecos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Endereco upsert
   */
  export type EnderecoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * The filter to search for the Endereco to update in case it exists.
     */
    where: EnderecoWhereUniqueInput
    /**
     * In case the Endereco found by the `where` argument doesn't exist, create a new Endereco with this data.
     */
    create: XOR<EnderecoCreateInput, EnderecoUncheckedCreateInput>
    /**
     * In case the Endereco was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnderecoUpdateInput, EnderecoUncheckedUpdateInput>
  }

  /**
   * Endereco delete
   */
  export type EnderecoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter which Endereco to delete.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco deleteMany
   */
  export type EnderecoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enderecos to delete
     */
    where?: EnderecoWhereInput
    /**
     * Limit how many Enderecos to delete.
     */
    limit?: number
  }

  /**
   * Endereco without action
   */
  export type EnderecoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Endereco
     */
    omit?: EnderecoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
  }


  /**
   * Model Profissional
   */

  export type AggregateProfissional = {
    _count: ProfissionalCountAggregateOutputType | null
    _min: ProfissionalMinAggregateOutputType | null
    _max: ProfissionalMaxAggregateOutputType | null
  }

  export type ProfissionalMinAggregateOutputType = {
    pessoa_id: string | null
    titulo: string | null
  }

  export type ProfissionalMaxAggregateOutputType = {
    pessoa_id: string | null
    titulo: string | null
  }

  export type ProfissionalCountAggregateOutputType = {
    pessoa_id: number
    titulo: number
    _all: number
  }


  export type ProfissionalMinAggregateInputType = {
    pessoa_id?: true
    titulo?: true
  }

  export type ProfissionalMaxAggregateInputType = {
    pessoa_id?: true
    titulo?: true
  }

  export type ProfissionalCountAggregateInputType = {
    pessoa_id?: true
    titulo?: true
    _all?: true
  }

  export type ProfissionalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profissional to aggregate.
     */
    where?: ProfissionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profissionals to fetch.
     */
    orderBy?: ProfissionalOrderByWithRelationInput | ProfissionalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfissionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profissionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profissionals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profissionals
    **/
    _count?: true | ProfissionalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfissionalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfissionalMaxAggregateInputType
  }

  export type GetProfissionalAggregateType<T extends ProfissionalAggregateArgs> = {
        [P in keyof T & keyof AggregateProfissional]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfissional[P]>
      : GetScalarType<T[P], AggregateProfissional[P]>
  }




  export type ProfissionalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfissionalWhereInput
    orderBy?: ProfissionalOrderByWithAggregationInput | ProfissionalOrderByWithAggregationInput[]
    by: ProfissionalScalarFieldEnum[] | ProfissionalScalarFieldEnum
    having?: ProfissionalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfissionalCountAggregateInputType | true
    _min?: ProfissionalMinAggregateInputType
    _max?: ProfissionalMaxAggregateInputType
  }

  export type ProfissionalGroupByOutputType = {
    pessoa_id: string
    titulo: string
    _count: ProfissionalCountAggregateOutputType | null
    _min: ProfissionalMinAggregateOutputType | null
    _max: ProfissionalMaxAggregateOutputType | null
  }

  type GetProfissionalGroupByPayload<T extends ProfissionalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfissionalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfissionalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfissionalGroupByOutputType[P]>
            : GetScalarType<T[P], ProfissionalGroupByOutputType[P]>
        }
      >
    >


  export type ProfissionalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    pessoa_id?: boolean
    titulo?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profissional"]>

  export type ProfissionalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    pessoa_id?: boolean
    titulo?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profissional"]>

  export type ProfissionalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    pessoa_id?: boolean
    titulo?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profissional"]>

  export type ProfissionalSelectScalar = {
    pessoa_id?: boolean
    titulo?: boolean
  }

  export type ProfissionalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"pessoa_id" | "titulo", ExtArgs["result"]["profissional"]>
  export type ProfissionalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }
  export type ProfissionalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }
  export type ProfissionalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }

  export type $ProfissionalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profissional"
    objects: {
      pessoa: Prisma.$PessoaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      pessoa_id: string
      titulo: string
    }, ExtArgs["result"]["profissional"]>
    composites: {}
  }

  type ProfissionalGetPayload<S extends boolean | null | undefined | ProfissionalDefaultArgs> = $Result.GetResult<Prisma.$ProfissionalPayload, S>

  type ProfissionalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfissionalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfissionalCountAggregateInputType | true
    }

  export interface ProfissionalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profissional'], meta: { name: 'Profissional' } }
    /**
     * Find zero or one Profissional that matches the filter.
     * @param {ProfissionalFindUniqueArgs} args - Arguments to find a Profissional
     * @example
     * // Get one Profissional
     * const profissional = await prisma.profissional.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfissionalFindUniqueArgs>(args: SelectSubset<T, ProfissionalFindUniqueArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profissional that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfissionalFindUniqueOrThrowArgs} args - Arguments to find a Profissional
     * @example
     * // Get one Profissional
     * const profissional = await prisma.profissional.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfissionalFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfissionalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profissional that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalFindFirstArgs} args - Arguments to find a Profissional
     * @example
     * // Get one Profissional
     * const profissional = await prisma.profissional.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfissionalFindFirstArgs>(args?: SelectSubset<T, ProfissionalFindFirstArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profissional that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalFindFirstOrThrowArgs} args - Arguments to find a Profissional
     * @example
     * // Get one Profissional
     * const profissional = await prisma.profissional.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfissionalFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfissionalFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profissionals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profissionals
     * const profissionals = await prisma.profissional.findMany()
     * 
     * // Get first 10 Profissionals
     * const profissionals = await prisma.profissional.findMany({ take: 10 })
     * 
     * // Only select the `pessoa_id`
     * const profissionalWithPessoa_idOnly = await prisma.profissional.findMany({ select: { pessoa_id: true } })
     * 
     */
    findMany<T extends ProfissionalFindManyArgs>(args?: SelectSubset<T, ProfissionalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profissional.
     * @param {ProfissionalCreateArgs} args - Arguments to create a Profissional.
     * @example
     * // Create one Profissional
     * const Profissional = await prisma.profissional.create({
     *   data: {
     *     // ... data to create a Profissional
     *   }
     * })
     * 
     */
    create<T extends ProfissionalCreateArgs>(args: SelectSubset<T, ProfissionalCreateArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profissionals.
     * @param {ProfissionalCreateManyArgs} args - Arguments to create many Profissionals.
     * @example
     * // Create many Profissionals
     * const profissional = await prisma.profissional.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfissionalCreateManyArgs>(args?: SelectSubset<T, ProfissionalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profissionals and returns the data saved in the database.
     * @param {ProfissionalCreateManyAndReturnArgs} args - Arguments to create many Profissionals.
     * @example
     * // Create many Profissionals
     * const profissional = await prisma.profissional.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profissionals and only return the `pessoa_id`
     * const profissionalWithPessoa_idOnly = await prisma.profissional.createManyAndReturn({
     *   select: { pessoa_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfissionalCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfissionalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profissional.
     * @param {ProfissionalDeleteArgs} args - Arguments to delete one Profissional.
     * @example
     * // Delete one Profissional
     * const Profissional = await prisma.profissional.delete({
     *   where: {
     *     // ... filter to delete one Profissional
     *   }
     * })
     * 
     */
    delete<T extends ProfissionalDeleteArgs>(args: SelectSubset<T, ProfissionalDeleteArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profissional.
     * @param {ProfissionalUpdateArgs} args - Arguments to update one Profissional.
     * @example
     * // Update one Profissional
     * const profissional = await prisma.profissional.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfissionalUpdateArgs>(args: SelectSubset<T, ProfissionalUpdateArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profissionals.
     * @param {ProfissionalDeleteManyArgs} args - Arguments to filter Profissionals to delete.
     * @example
     * // Delete a few Profissionals
     * const { count } = await prisma.profissional.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfissionalDeleteManyArgs>(args?: SelectSubset<T, ProfissionalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profissionals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profissionals
     * const profissional = await prisma.profissional.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfissionalUpdateManyArgs>(args: SelectSubset<T, ProfissionalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profissionals and returns the data updated in the database.
     * @param {ProfissionalUpdateManyAndReturnArgs} args - Arguments to update many Profissionals.
     * @example
     * // Update many Profissionals
     * const profissional = await prisma.profissional.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profissionals and only return the `pessoa_id`
     * const profissionalWithPessoa_idOnly = await prisma.profissional.updateManyAndReturn({
     *   select: { pessoa_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfissionalUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfissionalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profissional.
     * @param {ProfissionalUpsertArgs} args - Arguments to update or create a Profissional.
     * @example
     * // Update or create a Profissional
     * const profissional = await prisma.profissional.upsert({
     *   create: {
     *     // ... data to create a Profissional
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profissional we want to update
     *   }
     * })
     */
    upsert<T extends ProfissionalUpsertArgs>(args: SelectSubset<T, ProfissionalUpsertArgs<ExtArgs>>): Prisma__ProfissionalClient<$Result.GetResult<Prisma.$ProfissionalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profissionals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalCountArgs} args - Arguments to filter Profissionals to count.
     * @example
     * // Count the number of Profissionals
     * const count = await prisma.profissional.count({
     *   where: {
     *     // ... the filter for the Profissionals we want to count
     *   }
     * })
    **/
    count<T extends ProfissionalCountArgs>(
      args?: Subset<T, ProfissionalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfissionalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profissional.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfissionalAggregateArgs>(args: Subset<T, ProfissionalAggregateArgs>): Prisma.PrismaPromise<GetProfissionalAggregateType<T>>

    /**
     * Group by Profissional.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfissionalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfissionalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfissionalGroupByArgs['orderBy'] }
        : { orderBy?: ProfissionalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfissionalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfissionalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profissional model
   */
  readonly fields: ProfissionalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profissional.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfissionalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pessoa<T extends PessoaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PessoaDefaultArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profissional model
   */
  interface ProfissionalFieldRefs {
    readonly pessoa_id: FieldRef<"Profissional", 'String'>
    readonly titulo: FieldRef<"Profissional", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Profissional findUnique
   */
  export type ProfissionalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * Filter, which Profissional to fetch.
     */
    where: ProfissionalWhereUniqueInput
  }

  /**
   * Profissional findUniqueOrThrow
   */
  export type ProfissionalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * Filter, which Profissional to fetch.
     */
    where: ProfissionalWhereUniqueInput
  }

  /**
   * Profissional findFirst
   */
  export type ProfissionalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * Filter, which Profissional to fetch.
     */
    where?: ProfissionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profissionals to fetch.
     */
    orderBy?: ProfissionalOrderByWithRelationInput | ProfissionalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profissionals.
     */
    cursor?: ProfissionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profissionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profissionals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profissionals.
     */
    distinct?: ProfissionalScalarFieldEnum | ProfissionalScalarFieldEnum[]
  }

  /**
   * Profissional findFirstOrThrow
   */
  export type ProfissionalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * Filter, which Profissional to fetch.
     */
    where?: ProfissionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profissionals to fetch.
     */
    orderBy?: ProfissionalOrderByWithRelationInput | ProfissionalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profissionals.
     */
    cursor?: ProfissionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profissionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profissionals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profissionals.
     */
    distinct?: ProfissionalScalarFieldEnum | ProfissionalScalarFieldEnum[]
  }

  /**
   * Profissional findMany
   */
  export type ProfissionalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * Filter, which Profissionals to fetch.
     */
    where?: ProfissionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profissionals to fetch.
     */
    orderBy?: ProfissionalOrderByWithRelationInput | ProfissionalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profissionals.
     */
    cursor?: ProfissionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profissionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profissionals.
     */
    skip?: number
    distinct?: ProfissionalScalarFieldEnum | ProfissionalScalarFieldEnum[]
  }

  /**
   * Profissional create
   */
  export type ProfissionalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * The data needed to create a Profissional.
     */
    data: XOR<ProfissionalCreateInput, ProfissionalUncheckedCreateInput>
  }

  /**
   * Profissional createMany
   */
  export type ProfissionalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profissionals.
     */
    data: ProfissionalCreateManyInput | ProfissionalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profissional createManyAndReturn
   */
  export type ProfissionalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * The data used to create many Profissionals.
     */
    data: ProfissionalCreateManyInput | ProfissionalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profissional update
   */
  export type ProfissionalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * The data needed to update a Profissional.
     */
    data: XOR<ProfissionalUpdateInput, ProfissionalUncheckedUpdateInput>
    /**
     * Choose, which Profissional to update.
     */
    where: ProfissionalWhereUniqueInput
  }

  /**
   * Profissional updateMany
   */
  export type ProfissionalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profissionals.
     */
    data: XOR<ProfissionalUpdateManyMutationInput, ProfissionalUncheckedUpdateManyInput>
    /**
     * Filter which Profissionals to update
     */
    where?: ProfissionalWhereInput
    /**
     * Limit how many Profissionals to update.
     */
    limit?: number
  }

  /**
   * Profissional updateManyAndReturn
   */
  export type ProfissionalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * The data used to update Profissionals.
     */
    data: XOR<ProfissionalUpdateManyMutationInput, ProfissionalUncheckedUpdateManyInput>
    /**
     * Filter which Profissionals to update
     */
    where?: ProfissionalWhereInput
    /**
     * Limit how many Profissionals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profissional upsert
   */
  export type ProfissionalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * The filter to search for the Profissional to update in case it exists.
     */
    where: ProfissionalWhereUniqueInput
    /**
     * In case the Profissional found by the `where` argument doesn't exist, create a new Profissional with this data.
     */
    create: XOR<ProfissionalCreateInput, ProfissionalUncheckedCreateInput>
    /**
     * In case the Profissional was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfissionalUpdateInput, ProfissionalUncheckedUpdateInput>
  }

  /**
   * Profissional delete
   */
  export type ProfissionalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
    /**
     * Filter which Profissional to delete.
     */
    where: ProfissionalWhereUniqueInput
  }

  /**
   * Profissional deleteMany
   */
  export type ProfissionalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profissionals to delete
     */
    where?: ProfissionalWhereInput
    /**
     * Limit how many Profissionals to delete.
     */
    limit?: number
  }

  /**
   * Profissional without action
   */
  export type ProfissionalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profissional
     */
    select?: ProfissionalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profissional
     */
    omit?: ProfissionalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfissionalInclude<ExtArgs> | null
  }


  /**
   * Model servico_cliente
   */

  export type AggregateServico_cliente = {
    _count: Servico_clienteCountAggregateOutputType | null
    _avg: Servico_clienteAvgAggregateOutputType | null
    _sum: Servico_clienteSumAggregateOutputType | null
    _min: Servico_clienteMinAggregateOutputType | null
    _max: Servico_clienteMaxAggregateOutputType | null
  }

  export type Servico_clienteAvgAggregateOutputType = {
    id: number | null
    valor_oferecido: Decimal | null
  }

  export type Servico_clienteSumAggregateOutputType = {
    id: bigint | null
    valor_oferecido: Decimal | null
  }

  export type Servico_clienteMinAggregateOutputType = {
    id: bigint | null
    pessoa_id: string | null
    titulo: string | null
    descricao: string | null
    data_hora_agendamento: Date | null
    valor_oferecido: Decimal | null
    status: $Enums.enum_servico_cliente_status | null
    criado_em: Date | null
  }

  export type Servico_clienteMaxAggregateOutputType = {
    id: bigint | null
    pessoa_id: string | null
    titulo: string | null
    descricao: string | null
    data_hora_agendamento: Date | null
    valor_oferecido: Decimal | null
    status: $Enums.enum_servico_cliente_status | null
    criado_em: Date | null
  }

  export type Servico_clienteCountAggregateOutputType = {
    id: number
    pessoa_id: number
    titulo: number
    descricao: number
    data_hora_agendamento: number
    valor_oferecido: number
    status: number
    criado_em: number
    _all: number
  }


  export type Servico_clienteAvgAggregateInputType = {
    id?: true
    valor_oferecido?: true
  }

  export type Servico_clienteSumAggregateInputType = {
    id?: true
    valor_oferecido?: true
  }

  export type Servico_clienteMinAggregateInputType = {
    id?: true
    pessoa_id?: true
    titulo?: true
    descricao?: true
    data_hora_agendamento?: true
    valor_oferecido?: true
    status?: true
    criado_em?: true
  }

  export type Servico_clienteMaxAggregateInputType = {
    id?: true
    pessoa_id?: true
    titulo?: true
    descricao?: true
    data_hora_agendamento?: true
    valor_oferecido?: true
    status?: true
    criado_em?: true
  }

  export type Servico_clienteCountAggregateInputType = {
    id?: true
    pessoa_id?: true
    titulo?: true
    descricao?: true
    data_hora_agendamento?: true
    valor_oferecido?: true
    status?: true
    criado_em?: true
    _all?: true
  }

  export type Servico_clienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which servico_cliente to aggregate.
     */
    where?: servico_clienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_clientes to fetch.
     */
    orderBy?: servico_clienteOrderByWithRelationInput | servico_clienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: servico_clienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned servico_clientes
    **/
    _count?: true | Servico_clienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Servico_clienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Servico_clienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Servico_clienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Servico_clienteMaxAggregateInputType
  }

  export type GetServico_clienteAggregateType<T extends Servico_clienteAggregateArgs> = {
        [P in keyof T & keyof AggregateServico_cliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServico_cliente[P]>
      : GetScalarType<T[P], AggregateServico_cliente[P]>
  }




  export type servico_clienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: servico_clienteWhereInput
    orderBy?: servico_clienteOrderByWithAggregationInput | servico_clienteOrderByWithAggregationInput[]
    by: Servico_clienteScalarFieldEnum[] | Servico_clienteScalarFieldEnum
    having?: servico_clienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Servico_clienteCountAggregateInputType | true
    _avg?: Servico_clienteAvgAggregateInputType
    _sum?: Servico_clienteSumAggregateInputType
    _min?: Servico_clienteMinAggregateInputType
    _max?: Servico_clienteMaxAggregateInputType
  }

  export type Servico_clienteGroupByOutputType = {
    id: bigint
    pessoa_id: string
    titulo: string
    descricao: string
    data_hora_agendamento: Date
    valor_oferecido: Decimal | null
    status: $Enums.enum_servico_cliente_status | null
    criado_em: Date
    _count: Servico_clienteCountAggregateOutputType | null
    _avg: Servico_clienteAvgAggregateOutputType | null
    _sum: Servico_clienteSumAggregateOutputType | null
    _min: Servico_clienteMinAggregateOutputType | null
    _max: Servico_clienteMaxAggregateOutputType | null
  }

  type GetServico_clienteGroupByPayload<T extends servico_clienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Servico_clienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Servico_clienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Servico_clienteGroupByOutputType[P]>
            : GetScalarType<T[P], Servico_clienteGroupByOutputType[P]>
        }
      >
    >


  export type servico_clienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pessoa_id?: boolean
    titulo?: boolean
    descricao?: boolean
    data_hora_agendamento?: boolean
    valor_oferecido?: boolean
    status?: boolean
    criado_em?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    fotos?: boolean | servico_cliente$fotosArgs<ExtArgs>
    _count?: boolean | Servico_clienteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico_cliente"]>

  export type servico_clienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pessoa_id?: boolean
    titulo?: boolean
    descricao?: boolean
    data_hora_agendamento?: boolean
    valor_oferecido?: boolean
    status?: boolean
    criado_em?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico_cliente"]>

  export type servico_clienteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pessoa_id?: boolean
    titulo?: boolean
    descricao?: boolean
    data_hora_agendamento?: boolean
    valor_oferecido?: boolean
    status?: boolean
    criado_em?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico_cliente"]>

  export type servico_clienteSelectScalar = {
    id?: boolean
    pessoa_id?: boolean
    titulo?: boolean
    descricao?: boolean
    data_hora_agendamento?: boolean
    valor_oferecido?: boolean
    status?: boolean
    criado_em?: boolean
  }

  export type servico_clienteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pessoa_id" | "titulo" | "descricao" | "data_hora_agendamento" | "valor_oferecido" | "status" | "criado_em", ExtArgs["result"]["servico_cliente"]>
  export type servico_clienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    fotos?: boolean | servico_cliente$fotosArgs<ExtArgs>
    _count?: boolean | Servico_clienteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type servico_clienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }
  export type servico_clienteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
  }

  export type $servico_clientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "servico_cliente"
    objects: {
      pessoa: Prisma.$PessoaPayload<ExtArgs>
      fotos: Prisma.$servico_cliente_fotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      pessoa_id: string
      titulo: string
      descricao: string
      data_hora_agendamento: Date
      valor_oferecido: Prisma.Decimal | null
      status: $Enums.enum_servico_cliente_status | null
      criado_em: Date
    }, ExtArgs["result"]["servico_cliente"]>
    composites: {}
  }

  type servico_clienteGetPayload<S extends boolean | null | undefined | servico_clienteDefaultArgs> = $Result.GetResult<Prisma.$servico_clientePayload, S>

  type servico_clienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<servico_clienteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Servico_clienteCountAggregateInputType | true
    }

  export interface servico_clienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['servico_cliente'], meta: { name: 'servico_cliente' } }
    /**
     * Find zero or one Servico_cliente that matches the filter.
     * @param {servico_clienteFindUniqueArgs} args - Arguments to find a Servico_cliente
     * @example
     * // Get one Servico_cliente
     * const servico_cliente = await prisma.servico_cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends servico_clienteFindUniqueArgs>(args: SelectSubset<T, servico_clienteFindUniqueArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Servico_cliente that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {servico_clienteFindUniqueOrThrowArgs} args - Arguments to find a Servico_cliente
     * @example
     * // Get one Servico_cliente
     * const servico_cliente = await prisma.servico_cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends servico_clienteFindUniqueOrThrowArgs>(args: SelectSubset<T, servico_clienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servico_cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_clienteFindFirstArgs} args - Arguments to find a Servico_cliente
     * @example
     * // Get one Servico_cliente
     * const servico_cliente = await prisma.servico_cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends servico_clienteFindFirstArgs>(args?: SelectSubset<T, servico_clienteFindFirstArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servico_cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_clienteFindFirstOrThrowArgs} args - Arguments to find a Servico_cliente
     * @example
     * // Get one Servico_cliente
     * const servico_cliente = await prisma.servico_cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends servico_clienteFindFirstOrThrowArgs>(args?: SelectSubset<T, servico_clienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Servico_clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_clienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servico_clientes
     * const servico_clientes = await prisma.servico_cliente.findMany()
     * 
     * // Get first 10 Servico_clientes
     * const servico_clientes = await prisma.servico_cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servico_clienteWithIdOnly = await prisma.servico_cliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends servico_clienteFindManyArgs>(args?: SelectSubset<T, servico_clienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Servico_cliente.
     * @param {servico_clienteCreateArgs} args - Arguments to create a Servico_cliente.
     * @example
     * // Create one Servico_cliente
     * const Servico_cliente = await prisma.servico_cliente.create({
     *   data: {
     *     // ... data to create a Servico_cliente
     *   }
     * })
     * 
     */
    create<T extends servico_clienteCreateArgs>(args: SelectSubset<T, servico_clienteCreateArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Servico_clientes.
     * @param {servico_clienteCreateManyArgs} args - Arguments to create many Servico_clientes.
     * @example
     * // Create many Servico_clientes
     * const servico_cliente = await prisma.servico_cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends servico_clienteCreateManyArgs>(args?: SelectSubset<T, servico_clienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Servico_clientes and returns the data saved in the database.
     * @param {servico_clienteCreateManyAndReturnArgs} args - Arguments to create many Servico_clientes.
     * @example
     * // Create many Servico_clientes
     * const servico_cliente = await prisma.servico_cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Servico_clientes and only return the `id`
     * const servico_clienteWithIdOnly = await prisma.servico_cliente.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends servico_clienteCreateManyAndReturnArgs>(args?: SelectSubset<T, servico_clienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Servico_cliente.
     * @param {servico_clienteDeleteArgs} args - Arguments to delete one Servico_cliente.
     * @example
     * // Delete one Servico_cliente
     * const Servico_cliente = await prisma.servico_cliente.delete({
     *   where: {
     *     // ... filter to delete one Servico_cliente
     *   }
     * })
     * 
     */
    delete<T extends servico_clienteDeleteArgs>(args: SelectSubset<T, servico_clienteDeleteArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Servico_cliente.
     * @param {servico_clienteUpdateArgs} args - Arguments to update one Servico_cliente.
     * @example
     * // Update one Servico_cliente
     * const servico_cliente = await prisma.servico_cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends servico_clienteUpdateArgs>(args: SelectSubset<T, servico_clienteUpdateArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Servico_clientes.
     * @param {servico_clienteDeleteManyArgs} args - Arguments to filter Servico_clientes to delete.
     * @example
     * // Delete a few Servico_clientes
     * const { count } = await prisma.servico_cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends servico_clienteDeleteManyArgs>(args?: SelectSubset<T, servico_clienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servico_clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_clienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servico_clientes
     * const servico_cliente = await prisma.servico_cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends servico_clienteUpdateManyArgs>(args: SelectSubset<T, servico_clienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servico_clientes and returns the data updated in the database.
     * @param {servico_clienteUpdateManyAndReturnArgs} args - Arguments to update many Servico_clientes.
     * @example
     * // Update many Servico_clientes
     * const servico_cliente = await prisma.servico_cliente.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Servico_clientes and only return the `id`
     * const servico_clienteWithIdOnly = await prisma.servico_cliente.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends servico_clienteUpdateManyAndReturnArgs>(args: SelectSubset<T, servico_clienteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Servico_cliente.
     * @param {servico_clienteUpsertArgs} args - Arguments to update or create a Servico_cliente.
     * @example
     * // Update or create a Servico_cliente
     * const servico_cliente = await prisma.servico_cliente.upsert({
     *   create: {
     *     // ... data to create a Servico_cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servico_cliente we want to update
     *   }
     * })
     */
    upsert<T extends servico_clienteUpsertArgs>(args: SelectSubset<T, servico_clienteUpsertArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Servico_clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_clienteCountArgs} args - Arguments to filter Servico_clientes to count.
     * @example
     * // Count the number of Servico_clientes
     * const count = await prisma.servico_cliente.count({
     *   where: {
     *     // ... the filter for the Servico_clientes we want to count
     *   }
     * })
    **/
    count<T extends servico_clienteCountArgs>(
      args?: Subset<T, servico_clienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Servico_clienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servico_cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Servico_clienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Servico_clienteAggregateArgs>(args: Subset<T, Servico_clienteAggregateArgs>): Prisma.PrismaPromise<GetServico_clienteAggregateType<T>>

    /**
     * Group by Servico_cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_clienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends servico_clienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: servico_clienteGroupByArgs['orderBy'] }
        : { orderBy?: servico_clienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, servico_clienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServico_clienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the servico_cliente model
   */
  readonly fields: servico_clienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for servico_cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__servico_clienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pessoa<T extends PessoaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PessoaDefaultArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    fotos<T extends servico_cliente$fotosArgs<ExtArgs> = {}>(args?: Subset<T, servico_cliente$fotosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the servico_cliente model
   */
  interface servico_clienteFieldRefs {
    readonly id: FieldRef<"servico_cliente", 'BigInt'>
    readonly pessoa_id: FieldRef<"servico_cliente", 'String'>
    readonly titulo: FieldRef<"servico_cliente", 'String'>
    readonly descricao: FieldRef<"servico_cliente", 'String'>
    readonly data_hora_agendamento: FieldRef<"servico_cliente", 'DateTime'>
    readonly valor_oferecido: FieldRef<"servico_cliente", 'Decimal'>
    readonly status: FieldRef<"servico_cliente", 'enum_servico_cliente_status'>
    readonly criado_em: FieldRef<"servico_cliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * servico_cliente findUnique
   */
  export type servico_clienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente to fetch.
     */
    where: servico_clienteWhereUniqueInput
  }

  /**
   * servico_cliente findUniqueOrThrow
   */
  export type servico_clienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente to fetch.
     */
    where: servico_clienteWhereUniqueInput
  }

  /**
   * servico_cliente findFirst
   */
  export type servico_clienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente to fetch.
     */
    where?: servico_clienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_clientes to fetch.
     */
    orderBy?: servico_clienteOrderByWithRelationInput | servico_clienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for servico_clientes.
     */
    cursor?: servico_clienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of servico_clientes.
     */
    distinct?: Servico_clienteScalarFieldEnum | Servico_clienteScalarFieldEnum[]
  }

  /**
   * servico_cliente findFirstOrThrow
   */
  export type servico_clienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente to fetch.
     */
    where?: servico_clienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_clientes to fetch.
     */
    orderBy?: servico_clienteOrderByWithRelationInput | servico_clienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for servico_clientes.
     */
    cursor?: servico_clienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of servico_clientes.
     */
    distinct?: Servico_clienteScalarFieldEnum | Servico_clienteScalarFieldEnum[]
  }

  /**
   * servico_cliente findMany
   */
  export type servico_clienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * Filter, which servico_clientes to fetch.
     */
    where?: servico_clienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_clientes to fetch.
     */
    orderBy?: servico_clienteOrderByWithRelationInput | servico_clienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing servico_clientes.
     */
    cursor?: servico_clienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_clientes.
     */
    skip?: number
    distinct?: Servico_clienteScalarFieldEnum | Servico_clienteScalarFieldEnum[]
  }

  /**
   * servico_cliente create
   */
  export type servico_clienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * The data needed to create a servico_cliente.
     */
    data: XOR<servico_clienteCreateInput, servico_clienteUncheckedCreateInput>
  }

  /**
   * servico_cliente createMany
   */
  export type servico_clienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many servico_clientes.
     */
    data: servico_clienteCreateManyInput | servico_clienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * servico_cliente createManyAndReturn
   */
  export type servico_clienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * The data used to create many servico_clientes.
     */
    data: servico_clienteCreateManyInput | servico_clienteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * servico_cliente update
   */
  export type servico_clienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * The data needed to update a servico_cliente.
     */
    data: XOR<servico_clienteUpdateInput, servico_clienteUncheckedUpdateInput>
    /**
     * Choose, which servico_cliente to update.
     */
    where: servico_clienteWhereUniqueInput
  }

  /**
   * servico_cliente updateMany
   */
  export type servico_clienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update servico_clientes.
     */
    data: XOR<servico_clienteUpdateManyMutationInput, servico_clienteUncheckedUpdateManyInput>
    /**
     * Filter which servico_clientes to update
     */
    where?: servico_clienteWhereInput
    /**
     * Limit how many servico_clientes to update.
     */
    limit?: number
  }

  /**
   * servico_cliente updateManyAndReturn
   */
  export type servico_clienteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * The data used to update servico_clientes.
     */
    data: XOR<servico_clienteUpdateManyMutationInput, servico_clienteUncheckedUpdateManyInput>
    /**
     * Filter which servico_clientes to update
     */
    where?: servico_clienteWhereInput
    /**
     * Limit how many servico_clientes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * servico_cliente upsert
   */
  export type servico_clienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * The filter to search for the servico_cliente to update in case it exists.
     */
    where: servico_clienteWhereUniqueInput
    /**
     * In case the servico_cliente found by the `where` argument doesn't exist, create a new servico_cliente with this data.
     */
    create: XOR<servico_clienteCreateInput, servico_clienteUncheckedCreateInput>
    /**
     * In case the servico_cliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<servico_clienteUpdateInput, servico_clienteUncheckedUpdateInput>
  }

  /**
   * servico_cliente delete
   */
  export type servico_clienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
    /**
     * Filter which servico_cliente to delete.
     */
    where: servico_clienteWhereUniqueInput
  }

  /**
   * servico_cliente deleteMany
   */
  export type servico_clienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which servico_clientes to delete
     */
    where?: servico_clienteWhereInput
    /**
     * Limit how many servico_clientes to delete.
     */
    limit?: number
  }

  /**
   * servico_cliente.fotos
   */
  export type servico_cliente$fotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    where?: servico_cliente_fotoWhereInput
    orderBy?: servico_cliente_fotoOrderByWithRelationInput | servico_cliente_fotoOrderByWithRelationInput[]
    cursor?: servico_cliente_fotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Servico_cliente_fotoScalarFieldEnum | Servico_cliente_fotoScalarFieldEnum[]
  }

  /**
   * servico_cliente without action
   */
  export type servico_clienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente
     */
    select?: servico_clienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente
     */
    omit?: servico_clienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_clienteInclude<ExtArgs> | null
  }


  /**
   * Model servico_cliente_foto
   */

  export type AggregateServico_cliente_foto = {
    _count: Servico_cliente_fotoCountAggregateOutputType | null
    _avg: Servico_cliente_fotoAvgAggregateOutputType | null
    _sum: Servico_cliente_fotoSumAggregateOutputType | null
    _min: Servico_cliente_fotoMinAggregateOutputType | null
    _max: Servico_cliente_fotoMaxAggregateOutputType | null
  }

  export type Servico_cliente_fotoAvgAggregateOutputType = {
    servico_cliente_id: number | null
    ordem: number | null
  }

  export type Servico_cliente_fotoSumAggregateOutputType = {
    servico_cliente_id: bigint | null
    ordem: number | null
  }

  export type Servico_cliente_fotoMinAggregateOutputType = {
    servico_cliente_id: bigint | null
    md5: string | null
    uri_img: string | null
    ordem: number | null
  }

  export type Servico_cliente_fotoMaxAggregateOutputType = {
    servico_cliente_id: bigint | null
    md5: string | null
    uri_img: string | null
    ordem: number | null
  }

  export type Servico_cliente_fotoCountAggregateOutputType = {
    servico_cliente_id: number
    md5: number
    uri_img: number
    ordem: number
    _all: number
  }


  export type Servico_cliente_fotoAvgAggregateInputType = {
    servico_cliente_id?: true
    ordem?: true
  }

  export type Servico_cliente_fotoSumAggregateInputType = {
    servico_cliente_id?: true
    ordem?: true
  }

  export type Servico_cliente_fotoMinAggregateInputType = {
    servico_cliente_id?: true
    md5?: true
    uri_img?: true
    ordem?: true
  }

  export type Servico_cliente_fotoMaxAggregateInputType = {
    servico_cliente_id?: true
    md5?: true
    uri_img?: true
    ordem?: true
  }

  export type Servico_cliente_fotoCountAggregateInputType = {
    servico_cliente_id?: true
    md5?: true
    uri_img?: true
    ordem?: true
    _all?: true
  }

  export type Servico_cliente_fotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which servico_cliente_foto to aggregate.
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_cliente_fotos to fetch.
     */
    orderBy?: servico_cliente_fotoOrderByWithRelationInput | servico_cliente_fotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: servico_cliente_fotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_cliente_fotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_cliente_fotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned servico_cliente_fotos
    **/
    _count?: true | Servico_cliente_fotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Servico_cliente_fotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Servico_cliente_fotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Servico_cliente_fotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Servico_cliente_fotoMaxAggregateInputType
  }

  export type GetServico_cliente_fotoAggregateType<T extends Servico_cliente_fotoAggregateArgs> = {
        [P in keyof T & keyof AggregateServico_cliente_foto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServico_cliente_foto[P]>
      : GetScalarType<T[P], AggregateServico_cliente_foto[P]>
  }




  export type servico_cliente_fotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: servico_cliente_fotoWhereInput
    orderBy?: servico_cliente_fotoOrderByWithAggregationInput | servico_cliente_fotoOrderByWithAggregationInput[]
    by: Servico_cliente_fotoScalarFieldEnum[] | Servico_cliente_fotoScalarFieldEnum
    having?: servico_cliente_fotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Servico_cliente_fotoCountAggregateInputType | true
    _avg?: Servico_cliente_fotoAvgAggregateInputType
    _sum?: Servico_cliente_fotoSumAggregateInputType
    _min?: Servico_cliente_fotoMinAggregateInputType
    _max?: Servico_cliente_fotoMaxAggregateInputType
  }

  export type Servico_cliente_fotoGroupByOutputType = {
    servico_cliente_id: bigint
    md5: string
    uri_img: string
    ordem: number
    _count: Servico_cliente_fotoCountAggregateOutputType | null
    _avg: Servico_cliente_fotoAvgAggregateOutputType | null
    _sum: Servico_cliente_fotoSumAggregateOutputType | null
    _min: Servico_cliente_fotoMinAggregateOutputType | null
    _max: Servico_cliente_fotoMaxAggregateOutputType | null
  }

  type GetServico_cliente_fotoGroupByPayload<T extends servico_cliente_fotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Servico_cliente_fotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Servico_cliente_fotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Servico_cliente_fotoGroupByOutputType[P]>
            : GetScalarType<T[P], Servico_cliente_fotoGroupByOutputType[P]>
        }
      >
    >


  export type servico_cliente_fotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    servico_cliente_id?: boolean
    md5?: boolean
    uri_img?: boolean
    ordem?: boolean
    servico_cliente?: boolean | servico_clienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico_cliente_foto"]>

  export type servico_cliente_fotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    servico_cliente_id?: boolean
    md5?: boolean
    uri_img?: boolean
    ordem?: boolean
    servico_cliente?: boolean | servico_clienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico_cliente_foto"]>

  export type servico_cliente_fotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    servico_cliente_id?: boolean
    md5?: boolean
    uri_img?: boolean
    ordem?: boolean
    servico_cliente?: boolean | servico_clienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico_cliente_foto"]>

  export type servico_cliente_fotoSelectScalar = {
    servico_cliente_id?: boolean
    md5?: boolean
    uri_img?: boolean
    ordem?: boolean
  }

  export type servico_cliente_fotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"servico_cliente_id" | "md5" | "uri_img" | "ordem", ExtArgs["result"]["servico_cliente_foto"]>
  export type servico_cliente_fotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    servico_cliente?: boolean | servico_clienteDefaultArgs<ExtArgs>
  }
  export type servico_cliente_fotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    servico_cliente?: boolean | servico_clienteDefaultArgs<ExtArgs>
  }
  export type servico_cliente_fotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    servico_cliente?: boolean | servico_clienteDefaultArgs<ExtArgs>
  }

  export type $servico_cliente_fotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "servico_cliente_foto"
    objects: {
      servico_cliente: Prisma.$servico_clientePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      servico_cliente_id: bigint
      md5: string
      uri_img: string
      ordem: number
    }, ExtArgs["result"]["servico_cliente_foto"]>
    composites: {}
  }

  type servico_cliente_fotoGetPayload<S extends boolean | null | undefined | servico_cliente_fotoDefaultArgs> = $Result.GetResult<Prisma.$servico_cliente_fotoPayload, S>

  type servico_cliente_fotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<servico_cliente_fotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Servico_cliente_fotoCountAggregateInputType | true
    }

  export interface servico_cliente_fotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['servico_cliente_foto'], meta: { name: 'servico_cliente_foto' } }
    /**
     * Find zero or one Servico_cliente_foto that matches the filter.
     * @param {servico_cliente_fotoFindUniqueArgs} args - Arguments to find a Servico_cliente_foto
     * @example
     * // Get one Servico_cliente_foto
     * const servico_cliente_foto = await prisma.servico_cliente_foto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends servico_cliente_fotoFindUniqueArgs>(args: SelectSubset<T, servico_cliente_fotoFindUniqueArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Servico_cliente_foto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {servico_cliente_fotoFindUniqueOrThrowArgs} args - Arguments to find a Servico_cliente_foto
     * @example
     * // Get one Servico_cliente_foto
     * const servico_cliente_foto = await prisma.servico_cliente_foto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends servico_cliente_fotoFindUniqueOrThrowArgs>(args: SelectSubset<T, servico_cliente_fotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servico_cliente_foto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_cliente_fotoFindFirstArgs} args - Arguments to find a Servico_cliente_foto
     * @example
     * // Get one Servico_cliente_foto
     * const servico_cliente_foto = await prisma.servico_cliente_foto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends servico_cliente_fotoFindFirstArgs>(args?: SelectSubset<T, servico_cliente_fotoFindFirstArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servico_cliente_foto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_cliente_fotoFindFirstOrThrowArgs} args - Arguments to find a Servico_cliente_foto
     * @example
     * // Get one Servico_cliente_foto
     * const servico_cliente_foto = await prisma.servico_cliente_foto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends servico_cliente_fotoFindFirstOrThrowArgs>(args?: SelectSubset<T, servico_cliente_fotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Servico_cliente_fotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_cliente_fotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servico_cliente_fotos
     * const servico_cliente_fotos = await prisma.servico_cliente_foto.findMany()
     * 
     * // Get first 10 Servico_cliente_fotos
     * const servico_cliente_fotos = await prisma.servico_cliente_foto.findMany({ take: 10 })
     * 
     * // Only select the `servico_cliente_id`
     * const servico_cliente_fotoWithServico_cliente_idOnly = await prisma.servico_cliente_foto.findMany({ select: { servico_cliente_id: true } })
     * 
     */
    findMany<T extends servico_cliente_fotoFindManyArgs>(args?: SelectSubset<T, servico_cliente_fotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Servico_cliente_foto.
     * @param {servico_cliente_fotoCreateArgs} args - Arguments to create a Servico_cliente_foto.
     * @example
     * // Create one Servico_cliente_foto
     * const Servico_cliente_foto = await prisma.servico_cliente_foto.create({
     *   data: {
     *     // ... data to create a Servico_cliente_foto
     *   }
     * })
     * 
     */
    create<T extends servico_cliente_fotoCreateArgs>(args: SelectSubset<T, servico_cliente_fotoCreateArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Servico_cliente_fotos.
     * @param {servico_cliente_fotoCreateManyArgs} args - Arguments to create many Servico_cliente_fotos.
     * @example
     * // Create many Servico_cliente_fotos
     * const servico_cliente_foto = await prisma.servico_cliente_foto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends servico_cliente_fotoCreateManyArgs>(args?: SelectSubset<T, servico_cliente_fotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Servico_cliente_fotos and returns the data saved in the database.
     * @param {servico_cliente_fotoCreateManyAndReturnArgs} args - Arguments to create many Servico_cliente_fotos.
     * @example
     * // Create many Servico_cliente_fotos
     * const servico_cliente_foto = await prisma.servico_cliente_foto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Servico_cliente_fotos and only return the `servico_cliente_id`
     * const servico_cliente_fotoWithServico_cliente_idOnly = await prisma.servico_cliente_foto.createManyAndReturn({
     *   select: { servico_cliente_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends servico_cliente_fotoCreateManyAndReturnArgs>(args?: SelectSubset<T, servico_cliente_fotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Servico_cliente_foto.
     * @param {servico_cliente_fotoDeleteArgs} args - Arguments to delete one Servico_cliente_foto.
     * @example
     * // Delete one Servico_cliente_foto
     * const Servico_cliente_foto = await prisma.servico_cliente_foto.delete({
     *   where: {
     *     // ... filter to delete one Servico_cliente_foto
     *   }
     * })
     * 
     */
    delete<T extends servico_cliente_fotoDeleteArgs>(args: SelectSubset<T, servico_cliente_fotoDeleteArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Servico_cliente_foto.
     * @param {servico_cliente_fotoUpdateArgs} args - Arguments to update one Servico_cliente_foto.
     * @example
     * // Update one Servico_cliente_foto
     * const servico_cliente_foto = await prisma.servico_cliente_foto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends servico_cliente_fotoUpdateArgs>(args: SelectSubset<T, servico_cliente_fotoUpdateArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Servico_cliente_fotos.
     * @param {servico_cliente_fotoDeleteManyArgs} args - Arguments to filter Servico_cliente_fotos to delete.
     * @example
     * // Delete a few Servico_cliente_fotos
     * const { count } = await prisma.servico_cliente_foto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends servico_cliente_fotoDeleteManyArgs>(args?: SelectSubset<T, servico_cliente_fotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servico_cliente_fotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_cliente_fotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servico_cliente_fotos
     * const servico_cliente_foto = await prisma.servico_cliente_foto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends servico_cliente_fotoUpdateManyArgs>(args: SelectSubset<T, servico_cliente_fotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servico_cliente_fotos and returns the data updated in the database.
     * @param {servico_cliente_fotoUpdateManyAndReturnArgs} args - Arguments to update many Servico_cliente_fotos.
     * @example
     * // Update many Servico_cliente_fotos
     * const servico_cliente_foto = await prisma.servico_cliente_foto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Servico_cliente_fotos and only return the `servico_cliente_id`
     * const servico_cliente_fotoWithServico_cliente_idOnly = await prisma.servico_cliente_foto.updateManyAndReturn({
     *   select: { servico_cliente_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends servico_cliente_fotoUpdateManyAndReturnArgs>(args: SelectSubset<T, servico_cliente_fotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Servico_cliente_foto.
     * @param {servico_cliente_fotoUpsertArgs} args - Arguments to update or create a Servico_cliente_foto.
     * @example
     * // Update or create a Servico_cliente_foto
     * const servico_cliente_foto = await prisma.servico_cliente_foto.upsert({
     *   create: {
     *     // ... data to create a Servico_cliente_foto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servico_cliente_foto we want to update
     *   }
     * })
     */
    upsert<T extends servico_cliente_fotoUpsertArgs>(args: SelectSubset<T, servico_cliente_fotoUpsertArgs<ExtArgs>>): Prisma__servico_cliente_fotoClient<$Result.GetResult<Prisma.$servico_cliente_fotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Servico_cliente_fotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_cliente_fotoCountArgs} args - Arguments to filter Servico_cliente_fotos to count.
     * @example
     * // Count the number of Servico_cliente_fotos
     * const count = await prisma.servico_cliente_foto.count({
     *   where: {
     *     // ... the filter for the Servico_cliente_fotos we want to count
     *   }
     * })
    **/
    count<T extends servico_cliente_fotoCountArgs>(
      args?: Subset<T, servico_cliente_fotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Servico_cliente_fotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servico_cliente_foto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Servico_cliente_fotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Servico_cliente_fotoAggregateArgs>(args: Subset<T, Servico_cliente_fotoAggregateArgs>): Prisma.PrismaPromise<GetServico_cliente_fotoAggregateType<T>>

    /**
     * Group by Servico_cliente_foto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {servico_cliente_fotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends servico_cliente_fotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: servico_cliente_fotoGroupByArgs['orderBy'] }
        : { orderBy?: servico_cliente_fotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, servico_cliente_fotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServico_cliente_fotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the servico_cliente_foto model
   */
  readonly fields: servico_cliente_fotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for servico_cliente_foto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__servico_cliente_fotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    servico_cliente<T extends servico_clienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, servico_clienteDefaultArgs<ExtArgs>>): Prisma__servico_clienteClient<$Result.GetResult<Prisma.$servico_clientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the servico_cliente_foto model
   */
  interface servico_cliente_fotoFieldRefs {
    readonly servico_cliente_id: FieldRef<"servico_cliente_foto", 'BigInt'>
    readonly md5: FieldRef<"servico_cliente_foto", 'String'>
    readonly uri_img: FieldRef<"servico_cliente_foto", 'String'>
    readonly ordem: FieldRef<"servico_cliente_foto", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * servico_cliente_foto findUnique
   */
  export type servico_cliente_fotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente_foto to fetch.
     */
    where: servico_cliente_fotoWhereUniqueInput
  }

  /**
   * servico_cliente_foto findUniqueOrThrow
   */
  export type servico_cliente_fotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente_foto to fetch.
     */
    where: servico_cliente_fotoWhereUniqueInput
  }

  /**
   * servico_cliente_foto findFirst
   */
  export type servico_cliente_fotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente_foto to fetch.
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_cliente_fotos to fetch.
     */
    orderBy?: servico_cliente_fotoOrderByWithRelationInput | servico_cliente_fotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for servico_cliente_fotos.
     */
    cursor?: servico_cliente_fotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_cliente_fotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_cliente_fotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of servico_cliente_fotos.
     */
    distinct?: Servico_cliente_fotoScalarFieldEnum | Servico_cliente_fotoScalarFieldEnum[]
  }

  /**
   * servico_cliente_foto findFirstOrThrow
   */
  export type servico_cliente_fotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente_foto to fetch.
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_cliente_fotos to fetch.
     */
    orderBy?: servico_cliente_fotoOrderByWithRelationInput | servico_cliente_fotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for servico_cliente_fotos.
     */
    cursor?: servico_cliente_fotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_cliente_fotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_cliente_fotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of servico_cliente_fotos.
     */
    distinct?: Servico_cliente_fotoScalarFieldEnum | Servico_cliente_fotoScalarFieldEnum[]
  }

  /**
   * servico_cliente_foto findMany
   */
  export type servico_cliente_fotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * Filter, which servico_cliente_fotos to fetch.
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servico_cliente_fotos to fetch.
     */
    orderBy?: servico_cliente_fotoOrderByWithRelationInput | servico_cliente_fotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing servico_cliente_fotos.
     */
    cursor?: servico_cliente_fotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servico_cliente_fotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servico_cliente_fotos.
     */
    skip?: number
    distinct?: Servico_cliente_fotoScalarFieldEnum | Servico_cliente_fotoScalarFieldEnum[]
  }

  /**
   * servico_cliente_foto create
   */
  export type servico_cliente_fotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * The data needed to create a servico_cliente_foto.
     */
    data: XOR<servico_cliente_fotoCreateInput, servico_cliente_fotoUncheckedCreateInput>
  }

  /**
   * servico_cliente_foto createMany
   */
  export type servico_cliente_fotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many servico_cliente_fotos.
     */
    data: servico_cliente_fotoCreateManyInput | servico_cliente_fotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * servico_cliente_foto createManyAndReturn
   */
  export type servico_cliente_fotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * The data used to create many servico_cliente_fotos.
     */
    data: servico_cliente_fotoCreateManyInput | servico_cliente_fotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * servico_cliente_foto update
   */
  export type servico_cliente_fotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * The data needed to update a servico_cliente_foto.
     */
    data: XOR<servico_cliente_fotoUpdateInput, servico_cliente_fotoUncheckedUpdateInput>
    /**
     * Choose, which servico_cliente_foto to update.
     */
    where: servico_cliente_fotoWhereUniqueInput
  }

  /**
   * servico_cliente_foto updateMany
   */
  export type servico_cliente_fotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update servico_cliente_fotos.
     */
    data: XOR<servico_cliente_fotoUpdateManyMutationInput, servico_cliente_fotoUncheckedUpdateManyInput>
    /**
     * Filter which servico_cliente_fotos to update
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * Limit how many servico_cliente_fotos to update.
     */
    limit?: number
  }

  /**
   * servico_cliente_foto updateManyAndReturn
   */
  export type servico_cliente_fotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * The data used to update servico_cliente_fotos.
     */
    data: XOR<servico_cliente_fotoUpdateManyMutationInput, servico_cliente_fotoUncheckedUpdateManyInput>
    /**
     * Filter which servico_cliente_fotos to update
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * Limit how many servico_cliente_fotos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * servico_cliente_foto upsert
   */
  export type servico_cliente_fotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * The filter to search for the servico_cliente_foto to update in case it exists.
     */
    where: servico_cliente_fotoWhereUniqueInput
    /**
     * In case the servico_cliente_foto found by the `where` argument doesn't exist, create a new servico_cliente_foto with this data.
     */
    create: XOR<servico_cliente_fotoCreateInput, servico_cliente_fotoUncheckedCreateInput>
    /**
     * In case the servico_cliente_foto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<servico_cliente_fotoUpdateInput, servico_cliente_fotoUncheckedUpdateInput>
  }

  /**
   * servico_cliente_foto delete
   */
  export type servico_cliente_fotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
    /**
     * Filter which servico_cliente_foto to delete.
     */
    where: servico_cliente_fotoWhereUniqueInput
  }

  /**
   * servico_cliente_foto deleteMany
   */
  export type servico_cliente_fotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which servico_cliente_fotos to delete
     */
    where?: servico_cliente_fotoWhereInput
    /**
     * Limit how many servico_cliente_fotos to delete.
     */
    limit?: number
  }

  /**
   * servico_cliente_foto without action
   */
  export type servico_cliente_fotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servico_cliente_foto
     */
    select?: servico_cliente_fotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the servico_cliente_foto
     */
    omit?: servico_cliente_fotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: servico_cliente_fotoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const UnidadeFederativaScalarFieldEnum: {
    sigla: 'sigla',
    nome: 'nome',
    regiao: 'regiao'
  };

  export type UnidadeFederativaScalarFieldEnum = (typeof UnidadeFederativaScalarFieldEnum)[keyof typeof UnidadeFederativaScalarFieldEnum]


  export const CidadeScalarFieldEnum: {
    id: 'id',
    uf_sigla: 'uf_sigla',
    nome: 'nome',
    cep: 'cep',
    padrao: 'padrao'
  };

  export type CidadeScalarFieldEnum = (typeof CidadeScalarFieldEnum)[keyof typeof CidadeScalarFieldEnum]


  export const BairroScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cidade_id: 'cidade_id'
  };

  export type BairroScalarFieldEnum = (typeof BairroScalarFieldEnum)[keyof typeof BairroScalarFieldEnum]


  export const LogradouroScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cep: 'cep',
    bairro_id: 'bairro_id',
    tipo: 'tipo'
  };

  export type LogradouroScalarFieldEnum = (typeof LogradouroScalarFieldEnum)[keyof typeof LogradouroScalarFieldEnum]


  export const PessoaScalarFieldEnum: {
    id: 'id',
    cpf: 'cpf',
    nascimento: 'nascimento',
    celular: 'celular',
    criado_em: 'criado_em',
    atualizado_em: 'atualizado_em'
  };

  export type PessoaScalarFieldEnum = (typeof PessoaScalarFieldEnum)[keyof typeof PessoaScalarFieldEnum]


  export const EnderecoScalarFieldEnum: {
    logradouro_id: 'logradouro_id',
    pessoa_id: 'pessoa_id',
    numero: 'numero',
    complemento: 'complemento',
    referencia: 'referencia'
  };

  export type EnderecoScalarFieldEnum = (typeof EnderecoScalarFieldEnum)[keyof typeof EnderecoScalarFieldEnum]


  export const ProfissionalScalarFieldEnum: {
    pessoa_id: 'pessoa_id',
    titulo: 'titulo'
  };

  export type ProfissionalScalarFieldEnum = (typeof ProfissionalScalarFieldEnum)[keyof typeof ProfissionalScalarFieldEnum]


  export const Servico_clienteScalarFieldEnum: {
    id: 'id',
    pessoa_id: 'pessoa_id',
    titulo: 'titulo',
    descricao: 'descricao',
    data_hora_agendamento: 'data_hora_agendamento',
    valor_oferecido: 'valor_oferecido',
    status: 'status',
    criado_em: 'criado_em'
  };

  export type Servico_clienteScalarFieldEnum = (typeof Servico_clienteScalarFieldEnum)[keyof typeof Servico_clienteScalarFieldEnum]


  export const Servico_cliente_fotoScalarFieldEnum: {
    servico_cliente_id: 'servico_cliente_id',
    md5: 'md5',
    uri_img: 'uri_img',
    ordem: 'ordem'
  };

  export type Servico_cliente_fotoScalarFieldEnum = (typeof Servico_cliente_fotoScalarFieldEnum)[keyof typeof Servico_cliente_fotoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SiglaUF'
   */
  export type EnumSiglaUFFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SiglaUF'>
    


  /**
   * Reference to a field of type 'SiglaUF[]'
   */
  export type ListEnumSiglaUFFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SiglaUF[]'>
    


  /**
   * Reference to a field of type 'Regiao'
   */
  export type EnumRegiaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Regiao'>
    


  /**
   * Reference to a field of type 'Regiao[]'
   */
  export type ListEnumRegiaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Regiao[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'enum_servico_cliente_status'
   */
  export type Enumenum_servico_cliente_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'enum_servico_cliente_status'>
    


  /**
   * Reference to a field of type 'enum_servico_cliente_status[]'
   */
  export type ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'enum_servico_cliente_status[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    pessoa?: XOR<PessoaNullableScalarRelationFilter, PessoaWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    pessoa?: PessoaOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    pessoa?: XOR<PessoaNullableScalarRelationFilter, PessoaWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type UnidadeFederativaWhereInput = {
    AND?: UnidadeFederativaWhereInput | UnidadeFederativaWhereInput[]
    OR?: UnidadeFederativaWhereInput[]
    NOT?: UnidadeFederativaWhereInput | UnidadeFederativaWhereInput[]
    sigla?: EnumSiglaUFFilter<"UnidadeFederativa"> | $Enums.SiglaUF
    nome?: StringFilter<"UnidadeFederativa"> | string
    regiao?: EnumRegiaoFilter<"UnidadeFederativa"> | $Enums.Regiao
    cidades?: CidadeListRelationFilter
  }

  export type UnidadeFederativaOrderByWithRelationInput = {
    sigla?: SortOrder
    nome?: SortOrder
    regiao?: SortOrder
    cidades?: CidadeOrderByRelationAggregateInput
  }

  export type UnidadeFederativaWhereUniqueInput = Prisma.AtLeast<{
    sigla?: $Enums.SiglaUF
    nome?: string
    AND?: UnidadeFederativaWhereInput | UnidadeFederativaWhereInput[]
    OR?: UnidadeFederativaWhereInput[]
    NOT?: UnidadeFederativaWhereInput | UnidadeFederativaWhereInput[]
    regiao?: EnumRegiaoFilter<"UnidadeFederativa"> | $Enums.Regiao
    cidades?: CidadeListRelationFilter
  }, "sigla" | "nome">

  export type UnidadeFederativaOrderByWithAggregationInput = {
    sigla?: SortOrder
    nome?: SortOrder
    regiao?: SortOrder
    _count?: UnidadeFederativaCountOrderByAggregateInput
    _max?: UnidadeFederativaMaxOrderByAggregateInput
    _min?: UnidadeFederativaMinOrderByAggregateInput
  }

  export type UnidadeFederativaScalarWhereWithAggregatesInput = {
    AND?: UnidadeFederativaScalarWhereWithAggregatesInput | UnidadeFederativaScalarWhereWithAggregatesInput[]
    OR?: UnidadeFederativaScalarWhereWithAggregatesInput[]
    NOT?: UnidadeFederativaScalarWhereWithAggregatesInput | UnidadeFederativaScalarWhereWithAggregatesInput[]
    sigla?: EnumSiglaUFWithAggregatesFilter<"UnidadeFederativa"> | $Enums.SiglaUF
    nome?: StringWithAggregatesFilter<"UnidadeFederativa"> | string
    regiao?: EnumRegiaoWithAggregatesFilter<"UnidadeFederativa"> | $Enums.Regiao
  }

  export type CidadeWhereInput = {
    AND?: CidadeWhereInput | CidadeWhereInput[]
    OR?: CidadeWhereInput[]
    NOT?: CidadeWhereInput | CidadeWhereInput[]
    id?: IntFilter<"Cidade"> | number
    uf_sigla?: EnumSiglaUFFilter<"Cidade"> | $Enums.SiglaUF
    nome?: StringFilter<"Cidade"> | string
    cep?: StringNullableFilter<"Cidade"> | string | null
    padrao?: BoolFilter<"Cidade"> | boolean
    uf?: XOR<UnidadeFederativaScalarRelationFilter, UnidadeFederativaWhereInput>
    bairros?: BairroListRelationFilter
  }

  export type CidadeOrderByWithRelationInput = {
    id?: SortOrder
    uf_sigla?: SortOrder
    nome?: SortOrder
    cep?: SortOrderInput | SortOrder
    padrao?: SortOrder
    uf?: UnidadeFederativaOrderByWithRelationInput
    bairros?: BairroOrderByRelationAggregateInput
  }

  export type CidadeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cep?: string
    uf_sigla_nome?: CidadeUf_siglaNomeCompoundUniqueInput
    AND?: CidadeWhereInput | CidadeWhereInput[]
    OR?: CidadeWhereInput[]
    NOT?: CidadeWhereInput | CidadeWhereInput[]
    uf_sigla?: EnumSiglaUFFilter<"Cidade"> | $Enums.SiglaUF
    nome?: StringFilter<"Cidade"> | string
    padrao?: BoolFilter<"Cidade"> | boolean
    uf?: XOR<UnidadeFederativaScalarRelationFilter, UnidadeFederativaWhereInput>
    bairros?: BairroListRelationFilter
  }, "id" | "cep" | "uf_sigla_nome">

  export type CidadeOrderByWithAggregationInput = {
    id?: SortOrder
    uf_sigla?: SortOrder
    nome?: SortOrder
    cep?: SortOrderInput | SortOrder
    padrao?: SortOrder
    _count?: CidadeCountOrderByAggregateInput
    _avg?: CidadeAvgOrderByAggregateInput
    _max?: CidadeMaxOrderByAggregateInput
    _min?: CidadeMinOrderByAggregateInput
    _sum?: CidadeSumOrderByAggregateInput
  }

  export type CidadeScalarWhereWithAggregatesInput = {
    AND?: CidadeScalarWhereWithAggregatesInput | CidadeScalarWhereWithAggregatesInput[]
    OR?: CidadeScalarWhereWithAggregatesInput[]
    NOT?: CidadeScalarWhereWithAggregatesInput | CidadeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Cidade"> | number
    uf_sigla?: EnumSiglaUFWithAggregatesFilter<"Cidade"> | $Enums.SiglaUF
    nome?: StringWithAggregatesFilter<"Cidade"> | string
    cep?: StringNullableWithAggregatesFilter<"Cidade"> | string | null
    padrao?: BoolWithAggregatesFilter<"Cidade"> | boolean
  }

  export type BairroWhereInput = {
    AND?: BairroWhereInput | BairroWhereInput[]
    OR?: BairroWhereInput[]
    NOT?: BairroWhereInput | BairroWhereInput[]
    id?: BigIntFilter<"Bairro"> | bigint | number
    nome?: StringFilter<"Bairro"> | string
    cidade_id?: IntFilter<"Bairro"> | number
    cidade?: XOR<CidadeScalarRelationFilter, CidadeWhereInput>
    logradouro?: LogradouroListRelationFilter
  }

  export type BairroOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade_id?: SortOrder
    cidade?: CidadeOrderByWithRelationInput
    logradouro?: LogradouroOrderByRelationAggregateInput
  }

  export type BairroWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    cidade_id_nome?: BairroCidade_idNomeCompoundUniqueInput
    AND?: BairroWhereInput | BairroWhereInput[]
    OR?: BairroWhereInput[]
    NOT?: BairroWhereInput | BairroWhereInput[]
    nome?: StringFilter<"Bairro"> | string
    cidade_id?: IntFilter<"Bairro"> | number
    cidade?: XOR<CidadeScalarRelationFilter, CidadeWhereInput>
    logradouro?: LogradouroListRelationFilter
  }, "id" | "cidade_id_nome">

  export type BairroOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade_id?: SortOrder
    _count?: BairroCountOrderByAggregateInput
    _avg?: BairroAvgOrderByAggregateInput
    _max?: BairroMaxOrderByAggregateInput
    _min?: BairroMinOrderByAggregateInput
    _sum?: BairroSumOrderByAggregateInput
  }

  export type BairroScalarWhereWithAggregatesInput = {
    AND?: BairroScalarWhereWithAggregatesInput | BairroScalarWhereWithAggregatesInput[]
    OR?: BairroScalarWhereWithAggregatesInput[]
    NOT?: BairroScalarWhereWithAggregatesInput | BairroScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Bairro"> | bigint | number
    nome?: StringWithAggregatesFilter<"Bairro"> | string
    cidade_id?: IntWithAggregatesFilter<"Bairro"> | number
  }

  export type LogradouroWhereInput = {
    AND?: LogradouroWhereInput | LogradouroWhereInput[]
    OR?: LogradouroWhereInput[]
    NOT?: LogradouroWhereInput | LogradouroWhereInput[]
    id?: BigIntFilter<"Logradouro"> | bigint | number
    nome?: StringFilter<"Logradouro"> | string
    cep?: StringFilter<"Logradouro"> | string
    bairro_id?: BigIntFilter<"Logradouro"> | bigint | number
    tipo?: StringNullableFilter<"Logradouro"> | string | null
    bairro?: XOR<BairroScalarRelationFilter, BairroWhereInput>
    enderecos?: EnderecoListRelationFilter
  }

  export type LogradouroOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    bairro_id?: SortOrder
    tipo?: SortOrderInput | SortOrder
    bairro?: BairroOrderByWithRelationInput
    enderecos?: EnderecoOrderByRelationAggregateInput
  }

  export type LogradouroWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    cep?: string
    bairro_id_nome?: LogradouroBairro_idNomeCompoundUniqueInput
    AND?: LogradouroWhereInput | LogradouroWhereInput[]
    OR?: LogradouroWhereInput[]
    NOT?: LogradouroWhereInput | LogradouroWhereInput[]
    nome?: StringFilter<"Logradouro"> | string
    bairro_id?: BigIntFilter<"Logradouro"> | bigint | number
    tipo?: StringNullableFilter<"Logradouro"> | string | null
    bairro?: XOR<BairroScalarRelationFilter, BairroWhereInput>
    enderecos?: EnderecoListRelationFilter
  }, "id" | "cep" | "bairro_id_nome">

  export type LogradouroOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    bairro_id?: SortOrder
    tipo?: SortOrderInput | SortOrder
    _count?: LogradouroCountOrderByAggregateInput
    _avg?: LogradouroAvgOrderByAggregateInput
    _max?: LogradouroMaxOrderByAggregateInput
    _min?: LogradouroMinOrderByAggregateInput
    _sum?: LogradouroSumOrderByAggregateInput
  }

  export type LogradouroScalarWhereWithAggregatesInput = {
    AND?: LogradouroScalarWhereWithAggregatesInput | LogradouroScalarWhereWithAggregatesInput[]
    OR?: LogradouroScalarWhereWithAggregatesInput[]
    NOT?: LogradouroScalarWhereWithAggregatesInput | LogradouroScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Logradouro"> | bigint | number
    nome?: StringWithAggregatesFilter<"Logradouro"> | string
    cep?: StringWithAggregatesFilter<"Logradouro"> | string
    bairro_id?: BigIntWithAggregatesFilter<"Logradouro"> | bigint | number
    tipo?: StringNullableWithAggregatesFilter<"Logradouro"> | string | null
  }

  export type PessoaWhereInput = {
    AND?: PessoaWhereInput | PessoaWhereInput[]
    OR?: PessoaWhereInput[]
    NOT?: PessoaWhereInput | PessoaWhereInput[]
    id?: StringFilter<"Pessoa"> | string
    cpf?: StringFilter<"Pessoa"> | string
    nascimento?: DateTimeFilter<"Pessoa"> | Date | string
    celular?: StringFilter<"Pessoa"> | string
    criado_em?: DateTimeFilter<"Pessoa"> | Date | string
    atualizado_em?: DateTimeFilter<"Pessoa"> | Date | string
    enderecos?: EnderecoListRelationFilter
    profissional?: XOR<ProfissionalNullableScalarRelationFilter, ProfissionalWhereInput> | null
    servico_cliente?: Servico_clienteListRelationFilter
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PessoaOrderByWithRelationInput = {
    id?: SortOrder
    cpf?: SortOrder
    nascimento?: SortOrder
    celular?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
    enderecos?: EnderecoOrderByRelationAggregateInput
    profissional?: ProfissionalOrderByWithRelationInput
    servico_cliente?: servico_clienteOrderByRelationAggregateInput
    usuario?: UserOrderByWithRelationInput
  }

  export type PessoaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cpf?: string
    AND?: PessoaWhereInput | PessoaWhereInput[]
    OR?: PessoaWhereInput[]
    NOT?: PessoaWhereInput | PessoaWhereInput[]
    nascimento?: DateTimeFilter<"Pessoa"> | Date | string
    celular?: StringFilter<"Pessoa"> | string
    criado_em?: DateTimeFilter<"Pessoa"> | Date | string
    atualizado_em?: DateTimeFilter<"Pessoa"> | Date | string
    enderecos?: EnderecoListRelationFilter
    profissional?: XOR<ProfissionalNullableScalarRelationFilter, ProfissionalWhereInput> | null
    servico_cliente?: Servico_clienteListRelationFilter
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "cpf">

  export type PessoaOrderByWithAggregationInput = {
    id?: SortOrder
    cpf?: SortOrder
    nascimento?: SortOrder
    celular?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
    _count?: PessoaCountOrderByAggregateInput
    _max?: PessoaMaxOrderByAggregateInput
    _min?: PessoaMinOrderByAggregateInput
  }

  export type PessoaScalarWhereWithAggregatesInput = {
    AND?: PessoaScalarWhereWithAggregatesInput | PessoaScalarWhereWithAggregatesInput[]
    OR?: PessoaScalarWhereWithAggregatesInput[]
    NOT?: PessoaScalarWhereWithAggregatesInput | PessoaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pessoa"> | string
    cpf?: StringWithAggregatesFilter<"Pessoa"> | string
    nascimento?: DateTimeWithAggregatesFilter<"Pessoa"> | Date | string
    celular?: StringWithAggregatesFilter<"Pessoa"> | string
    criado_em?: DateTimeWithAggregatesFilter<"Pessoa"> | Date | string
    atualizado_em?: DateTimeWithAggregatesFilter<"Pessoa"> | Date | string
  }

  export type EnderecoWhereInput = {
    AND?: EnderecoWhereInput | EnderecoWhereInput[]
    OR?: EnderecoWhereInput[]
    NOT?: EnderecoWhereInput | EnderecoWhereInput[]
    logradouro_id?: BigIntFilter<"Endereco"> | bigint | number
    pessoa_id?: StringFilter<"Endereco"> | string
    numero?: StringFilter<"Endereco"> | string
    complemento?: StringNullableFilter<"Endereco"> | string | null
    referencia?: StringNullableFilter<"Endereco"> | string | null
    logradouro?: XOR<LogradouroScalarRelationFilter, LogradouroWhereInput>
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
  }

  export type EnderecoOrderByWithRelationInput = {
    logradouro_id?: SortOrder
    pessoa_id?: SortOrder
    numero?: SortOrder
    complemento?: SortOrderInput | SortOrder
    referencia?: SortOrderInput | SortOrder
    logradouro?: LogradouroOrderByWithRelationInput
    pessoa?: PessoaOrderByWithRelationInput
  }

  export type EnderecoWhereUniqueInput = Prisma.AtLeast<{
    pessoa_id_logradouro_id_numero?: EnderecoPessoa_idLogradouro_idNumeroCompoundUniqueInput
    AND?: EnderecoWhereInput | EnderecoWhereInput[]
    OR?: EnderecoWhereInput[]
    NOT?: EnderecoWhereInput | EnderecoWhereInput[]
    logradouro_id?: BigIntFilter<"Endereco"> | bigint | number
    pessoa_id?: StringFilter<"Endereco"> | string
    numero?: StringFilter<"Endereco"> | string
    complemento?: StringNullableFilter<"Endereco"> | string | null
    referencia?: StringNullableFilter<"Endereco"> | string | null
    logradouro?: XOR<LogradouroScalarRelationFilter, LogradouroWhereInput>
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
  }, "pessoa_id_logradouro_id_numero">

  export type EnderecoOrderByWithAggregationInput = {
    logradouro_id?: SortOrder
    pessoa_id?: SortOrder
    numero?: SortOrder
    complemento?: SortOrderInput | SortOrder
    referencia?: SortOrderInput | SortOrder
    _count?: EnderecoCountOrderByAggregateInput
    _avg?: EnderecoAvgOrderByAggregateInput
    _max?: EnderecoMaxOrderByAggregateInput
    _min?: EnderecoMinOrderByAggregateInput
    _sum?: EnderecoSumOrderByAggregateInput
  }

  export type EnderecoScalarWhereWithAggregatesInput = {
    AND?: EnderecoScalarWhereWithAggregatesInput | EnderecoScalarWhereWithAggregatesInput[]
    OR?: EnderecoScalarWhereWithAggregatesInput[]
    NOT?: EnderecoScalarWhereWithAggregatesInput | EnderecoScalarWhereWithAggregatesInput[]
    logradouro_id?: BigIntWithAggregatesFilter<"Endereco"> | bigint | number
    pessoa_id?: StringWithAggregatesFilter<"Endereco"> | string
    numero?: StringWithAggregatesFilter<"Endereco"> | string
    complemento?: StringNullableWithAggregatesFilter<"Endereco"> | string | null
    referencia?: StringNullableWithAggregatesFilter<"Endereco"> | string | null
  }

  export type ProfissionalWhereInput = {
    AND?: ProfissionalWhereInput | ProfissionalWhereInput[]
    OR?: ProfissionalWhereInput[]
    NOT?: ProfissionalWhereInput | ProfissionalWhereInput[]
    pessoa_id?: StringFilter<"Profissional"> | string
    titulo?: StringFilter<"Profissional"> | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
  }

  export type ProfissionalOrderByWithRelationInput = {
    pessoa_id?: SortOrder
    titulo?: SortOrder
    pessoa?: PessoaOrderByWithRelationInput
  }

  export type ProfissionalWhereUniqueInput = Prisma.AtLeast<{
    pessoa_id?: string
    AND?: ProfissionalWhereInput | ProfissionalWhereInput[]
    OR?: ProfissionalWhereInput[]
    NOT?: ProfissionalWhereInput | ProfissionalWhereInput[]
    titulo?: StringFilter<"Profissional"> | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
  }, "pessoa_id">

  export type ProfissionalOrderByWithAggregationInput = {
    pessoa_id?: SortOrder
    titulo?: SortOrder
    _count?: ProfissionalCountOrderByAggregateInput
    _max?: ProfissionalMaxOrderByAggregateInput
    _min?: ProfissionalMinOrderByAggregateInput
  }

  export type ProfissionalScalarWhereWithAggregatesInput = {
    AND?: ProfissionalScalarWhereWithAggregatesInput | ProfissionalScalarWhereWithAggregatesInput[]
    OR?: ProfissionalScalarWhereWithAggregatesInput[]
    NOT?: ProfissionalScalarWhereWithAggregatesInput | ProfissionalScalarWhereWithAggregatesInput[]
    pessoa_id?: StringWithAggregatesFilter<"Profissional"> | string
    titulo?: StringWithAggregatesFilter<"Profissional"> | string
  }

  export type servico_clienteWhereInput = {
    AND?: servico_clienteWhereInput | servico_clienteWhereInput[]
    OR?: servico_clienteWhereInput[]
    NOT?: servico_clienteWhereInput | servico_clienteWhereInput[]
    id?: BigIntFilter<"servico_cliente"> | bigint | number
    pessoa_id?: StringFilter<"servico_cliente"> | string
    titulo?: StringFilter<"servico_cliente"> | string
    descricao?: StringFilter<"servico_cliente"> | string
    data_hora_agendamento?: DateTimeFilter<"servico_cliente"> | Date | string
    valor_oferecido?: DecimalNullableFilter<"servico_cliente"> | Decimal | DecimalJsLike | number | string | null
    status?: Enumenum_servico_cliente_statusNullableFilter<"servico_cliente"> | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFilter<"servico_cliente"> | Date | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    fotos?: Servico_cliente_fotoListRelationFilter
  }

  export type servico_clienteOrderByWithRelationInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data_hora_agendamento?: SortOrder
    valor_oferecido?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    criado_em?: SortOrder
    pessoa?: PessoaOrderByWithRelationInput
    fotos?: servico_cliente_fotoOrderByRelationAggregateInput
  }

  export type servico_clienteWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: servico_clienteWhereInput | servico_clienteWhereInput[]
    OR?: servico_clienteWhereInput[]
    NOT?: servico_clienteWhereInput | servico_clienteWhereInput[]
    pessoa_id?: StringFilter<"servico_cliente"> | string
    titulo?: StringFilter<"servico_cliente"> | string
    descricao?: StringFilter<"servico_cliente"> | string
    data_hora_agendamento?: DateTimeFilter<"servico_cliente"> | Date | string
    valor_oferecido?: DecimalNullableFilter<"servico_cliente"> | Decimal | DecimalJsLike | number | string | null
    status?: Enumenum_servico_cliente_statusNullableFilter<"servico_cliente"> | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFilter<"servico_cliente"> | Date | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    fotos?: Servico_cliente_fotoListRelationFilter
  }, "id">

  export type servico_clienteOrderByWithAggregationInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data_hora_agendamento?: SortOrder
    valor_oferecido?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    criado_em?: SortOrder
    _count?: servico_clienteCountOrderByAggregateInput
    _avg?: servico_clienteAvgOrderByAggregateInput
    _max?: servico_clienteMaxOrderByAggregateInput
    _min?: servico_clienteMinOrderByAggregateInput
    _sum?: servico_clienteSumOrderByAggregateInput
  }

  export type servico_clienteScalarWhereWithAggregatesInput = {
    AND?: servico_clienteScalarWhereWithAggregatesInput | servico_clienteScalarWhereWithAggregatesInput[]
    OR?: servico_clienteScalarWhereWithAggregatesInput[]
    NOT?: servico_clienteScalarWhereWithAggregatesInput | servico_clienteScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"servico_cliente"> | bigint | number
    pessoa_id?: StringWithAggregatesFilter<"servico_cliente"> | string
    titulo?: StringWithAggregatesFilter<"servico_cliente"> | string
    descricao?: StringWithAggregatesFilter<"servico_cliente"> | string
    data_hora_agendamento?: DateTimeWithAggregatesFilter<"servico_cliente"> | Date | string
    valor_oferecido?: DecimalNullableWithAggregatesFilter<"servico_cliente"> | Decimal | DecimalJsLike | number | string | null
    status?: Enumenum_servico_cliente_statusNullableWithAggregatesFilter<"servico_cliente"> | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeWithAggregatesFilter<"servico_cliente"> | Date | string
  }

  export type servico_cliente_fotoWhereInput = {
    AND?: servico_cliente_fotoWhereInput | servico_cliente_fotoWhereInput[]
    OR?: servico_cliente_fotoWhereInput[]
    NOT?: servico_cliente_fotoWhereInput | servico_cliente_fotoWhereInput[]
    servico_cliente_id?: BigIntFilter<"servico_cliente_foto"> | bigint | number
    md5?: StringFilter<"servico_cliente_foto"> | string
    uri_img?: StringFilter<"servico_cliente_foto"> | string
    ordem?: IntFilter<"servico_cliente_foto"> | number
    servico_cliente?: XOR<Servico_clienteScalarRelationFilter, servico_clienteWhereInput>
  }

  export type servico_cliente_fotoOrderByWithRelationInput = {
    servico_cliente_id?: SortOrder
    md5?: SortOrder
    uri_img?: SortOrder
    ordem?: SortOrder
    servico_cliente?: servico_clienteOrderByWithRelationInput
  }

  export type servico_cliente_fotoWhereUniqueInput = Prisma.AtLeast<{
    servico_cliente_id_md5?: servico_cliente_fotoServico_cliente_idMd5CompoundUniqueInput
    AND?: servico_cliente_fotoWhereInput | servico_cliente_fotoWhereInput[]
    OR?: servico_cliente_fotoWhereInput[]
    NOT?: servico_cliente_fotoWhereInput | servico_cliente_fotoWhereInput[]
    servico_cliente_id?: BigIntFilter<"servico_cliente_foto"> | bigint | number
    md5?: StringFilter<"servico_cliente_foto"> | string
    uri_img?: StringFilter<"servico_cliente_foto"> | string
    ordem?: IntFilter<"servico_cliente_foto"> | number
    servico_cliente?: XOR<Servico_clienteScalarRelationFilter, servico_clienteWhereInput>
  }, "servico_cliente_id_md5" | "servico_cliente_id_md5">

  export type servico_cliente_fotoOrderByWithAggregationInput = {
    servico_cliente_id?: SortOrder
    md5?: SortOrder
    uri_img?: SortOrder
    ordem?: SortOrder
    _count?: servico_cliente_fotoCountOrderByAggregateInput
    _avg?: servico_cliente_fotoAvgOrderByAggregateInput
    _max?: servico_cliente_fotoMaxOrderByAggregateInput
    _min?: servico_cliente_fotoMinOrderByAggregateInput
    _sum?: servico_cliente_fotoSumOrderByAggregateInput
  }

  export type servico_cliente_fotoScalarWhereWithAggregatesInput = {
    AND?: servico_cliente_fotoScalarWhereWithAggregatesInput | servico_cliente_fotoScalarWhereWithAggregatesInput[]
    OR?: servico_cliente_fotoScalarWhereWithAggregatesInput[]
    NOT?: servico_cliente_fotoScalarWhereWithAggregatesInput | servico_cliente_fotoScalarWhereWithAggregatesInput[]
    servico_cliente_id?: BigIntWithAggregatesFilter<"servico_cliente_foto"> | bigint | number
    md5?: StringWithAggregatesFilter<"servico_cliente_foto"> | string
    uri_img?: StringWithAggregatesFilter<"servico_cliente_foto"> | string
    ordem?: IntWithAggregatesFilter<"servico_cliente_foto"> | number
  }

  export type UserCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    pessoa?: PessoaCreateNestedOneWithoutUsuarioInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    pessoa?: PessoaUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    pessoa?: PessoaUpdateOneWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    pessoa?: PessoaUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnidadeFederativaCreateInput = {
    sigla: $Enums.SiglaUF
    nome: string
    regiao: $Enums.Regiao
    cidades?: CidadeCreateNestedManyWithoutUfInput
  }

  export type UnidadeFederativaUncheckedCreateInput = {
    sigla: $Enums.SiglaUF
    nome: string
    regiao: $Enums.Regiao
    cidades?: CidadeUncheckedCreateNestedManyWithoutUfInput
  }

  export type UnidadeFederativaUpdateInput = {
    sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    regiao?: EnumRegiaoFieldUpdateOperationsInput | $Enums.Regiao
    cidades?: CidadeUpdateManyWithoutUfNestedInput
  }

  export type UnidadeFederativaUncheckedUpdateInput = {
    sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    regiao?: EnumRegiaoFieldUpdateOperationsInput | $Enums.Regiao
    cidades?: CidadeUncheckedUpdateManyWithoutUfNestedInput
  }

  export type UnidadeFederativaCreateManyInput = {
    sigla: $Enums.SiglaUF
    nome: string
    regiao: $Enums.Regiao
  }

  export type UnidadeFederativaUpdateManyMutationInput = {
    sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    regiao?: EnumRegiaoFieldUpdateOperationsInput | $Enums.Regiao
  }

  export type UnidadeFederativaUncheckedUpdateManyInput = {
    sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    regiao?: EnumRegiaoFieldUpdateOperationsInput | $Enums.Regiao
  }

  export type CidadeCreateInput = {
    nome: string
    cep?: string | null
    padrao?: boolean
    uf: UnidadeFederativaCreateNestedOneWithoutCidadesInput
    bairros?: BairroCreateNestedManyWithoutCidadeInput
  }

  export type CidadeUncheckedCreateInput = {
    id?: number
    uf_sigla: $Enums.SiglaUF
    nome: string
    cep?: string | null
    padrao?: boolean
    bairros?: BairroUncheckedCreateNestedManyWithoutCidadeInput
  }

  export type CidadeUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    uf?: UnidadeFederativaUpdateOneRequiredWithoutCidadesNestedInput
    bairros?: BairroUpdateManyWithoutCidadeNestedInput
  }

  export type CidadeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uf_sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    bairros?: BairroUncheckedUpdateManyWithoutCidadeNestedInput
  }

  export type CidadeCreateManyInput = {
    id?: number
    uf_sigla: $Enums.SiglaUF
    nome: string
    cep?: string | null
    padrao?: boolean
  }

  export type CidadeUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CidadeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uf_sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BairroCreateInput = {
    id?: bigint | number
    nome: string
    cidade: CidadeCreateNestedOneWithoutBairrosInput
    logradouro?: LogradouroCreateNestedManyWithoutBairroInput
  }

  export type BairroUncheckedCreateInput = {
    id?: bigint | number
    nome: string
    cidade_id: number
    logradouro?: LogradouroUncheckedCreateNestedManyWithoutBairroInput
  }

  export type BairroUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: CidadeUpdateOneRequiredWithoutBairrosNestedInput
    logradouro?: LogradouroUpdateManyWithoutBairroNestedInput
  }

  export type BairroUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cidade_id?: IntFieldUpdateOperationsInput | number
    logradouro?: LogradouroUncheckedUpdateManyWithoutBairroNestedInput
  }

  export type BairroCreateManyInput = {
    id?: bigint | number
    nome: string
    cidade_id: number
  }

  export type BairroUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type BairroUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cidade_id?: IntFieldUpdateOperationsInput | number
  }

  export type LogradouroCreateInput = {
    id?: bigint | number
    nome: string
    cep: string
    tipo?: string | null
    bairro: BairroCreateNestedOneWithoutLogradouroInput
    enderecos?: EnderecoCreateNestedManyWithoutLogradouroInput
  }

  export type LogradouroUncheckedCreateInput = {
    id?: bigint | number
    nome: string
    cep: string
    bairro_id: bigint | number
    tipo?: string | null
    enderecos?: EnderecoUncheckedCreateNestedManyWithoutLogradouroInput
  }

  export type LogradouroUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: BairroUpdateOneRequiredWithoutLogradouroNestedInput
    enderecos?: EnderecoUpdateManyWithoutLogradouroNestedInput
  }

  export type LogradouroUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    bairro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
    enderecos?: EnderecoUncheckedUpdateManyWithoutLogradouroNestedInput
  }

  export type LogradouroCreateManyInput = {
    id?: bigint | number
    nome: string
    cep: string
    bairro_id: bigint | number
    tipo?: string | null
  }

  export type LogradouroUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LogradouroUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    bairro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PessoaCreateInput = {
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoCreateNestedManyWithoutPessoaInput
    profissional?: ProfissionalCreateNestedOneWithoutPessoaInput
    servico_cliente?: servico_clienteCreateNestedManyWithoutPessoaInput
    usuario: UserCreateNestedOneWithoutPessoaInput
  }

  export type PessoaUncheckedCreateInput = {
    id: string
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoUncheckedCreateNestedManyWithoutPessoaInput
    profissional?: ProfissionalUncheckedCreateNestedOneWithoutPessoaInput
    servico_cliente?: servico_clienteUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaUpdateInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUpdateManyWithoutPessoaNestedInput
    profissional?: ProfissionalUpdateOneWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUpdateManyWithoutPessoaNestedInput
    usuario?: UserUpdateOneRequiredWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUncheckedUpdateManyWithoutPessoaNestedInput
    profissional?: ProfissionalUncheckedUpdateOneWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaCreateManyInput = {
    id: string
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type PessoaUpdateManyMutationInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PessoaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoCreateInput = {
    numero: string
    complemento?: string | null
    referencia?: string | null
    logradouro: LogradouroCreateNestedOneWithoutEnderecosInput
    pessoa: PessoaCreateNestedOneWithoutEnderecosInput
  }

  export type EnderecoUncheckedCreateInput = {
    logradouro_id: bigint | number
    pessoa_id: string
    numero: string
    complemento?: string | null
    referencia?: string | null
  }

  export type EnderecoUpdateInput = {
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    logradouro?: LogradouroUpdateOneRequiredWithoutEnderecosNestedInput
    pessoa?: PessoaUpdateOneRequiredWithoutEnderecosNestedInput
  }

  export type EnderecoUncheckedUpdateInput = {
    logradouro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    pessoa_id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnderecoCreateManyInput = {
    logradouro_id: bigint | number
    pessoa_id: string
    numero: string
    complemento?: string | null
    referencia?: string | null
  }

  export type EnderecoUpdateManyMutationInput = {
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnderecoUncheckedUpdateManyInput = {
    logradouro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    pessoa_id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProfissionalCreateInput = {
    titulo: string
    pessoa: PessoaCreateNestedOneWithoutProfissionalInput
  }

  export type ProfissionalUncheckedCreateInput = {
    pessoa_id: string
    titulo: string
  }

  export type ProfissionalUpdateInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    pessoa?: PessoaUpdateOneRequiredWithoutProfissionalNestedInput
  }

  export type ProfissionalUncheckedUpdateInput = {
    pessoa_id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
  }

  export type ProfissionalCreateManyInput = {
    pessoa_id: string
    titulo: string
  }

  export type ProfissionalUpdateManyMutationInput = {
    titulo?: StringFieldUpdateOperationsInput | string
  }

  export type ProfissionalUncheckedUpdateManyInput = {
    pessoa_id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
  }

  export type servico_clienteCreateInput = {
    id?: bigint | number
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
    pessoa: PessoaCreateNestedOneWithoutServico_clienteInput
    fotos?: servico_cliente_fotoCreateNestedManyWithoutServico_clienteInput
  }

  export type servico_clienteUncheckedCreateInput = {
    id?: bigint | number
    pessoa_id: string
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
    fotos?: servico_cliente_fotoUncheckedCreateNestedManyWithoutServico_clienteInput
  }

  export type servico_clienteUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    pessoa?: PessoaUpdateOneRequiredWithoutServico_clienteNestedInput
    fotos?: servico_cliente_fotoUpdateManyWithoutServico_clienteNestedInput
  }

  export type servico_clienteUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pessoa_id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    fotos?: servico_cliente_fotoUncheckedUpdateManyWithoutServico_clienteNestedInput
  }

  export type servico_clienteCreateManyInput = {
    id?: bigint | number
    pessoa_id: string
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
  }

  export type servico_clienteUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type servico_clienteUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pessoa_id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type servico_cliente_fotoCreateInput = {
    md5: string
    uri_img: string
    ordem: number
    servico_cliente: servico_clienteCreateNestedOneWithoutFotosInput
  }

  export type servico_cliente_fotoUncheckedCreateInput = {
    servico_cliente_id: bigint | number
    md5: string
    uri_img: string
    ordem: number
  }

  export type servico_cliente_fotoUpdateInput = {
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    servico_cliente?: servico_clienteUpdateOneRequiredWithoutFotosNestedInput
  }

  export type servico_cliente_fotoUncheckedUpdateInput = {
    servico_cliente_id?: BigIntFieldUpdateOperationsInput | bigint | number
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type servico_cliente_fotoCreateManyInput = {
    servico_cliente_id: bigint | number
    md5: string
    uri_img: string
    ordem: number
  }

  export type servico_cliente_fotoUpdateManyMutationInput = {
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type servico_cliente_fotoUncheckedUpdateManyInput = {
    servico_cliente_id?: BigIntFieldUpdateOperationsInput | bigint | number
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type PessoaNullableScalarRelationFilter = {
    is?: PessoaWhereInput | null
    isNot?: PessoaWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSiglaUFFilter<$PrismaModel = never> = {
    equals?: $Enums.SiglaUF | EnumSiglaUFFieldRefInput<$PrismaModel>
    in?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    not?: NestedEnumSiglaUFFilter<$PrismaModel> | $Enums.SiglaUF
  }

  export type EnumRegiaoFilter<$PrismaModel = never> = {
    equals?: $Enums.Regiao | EnumRegiaoFieldRefInput<$PrismaModel>
    in?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    not?: NestedEnumRegiaoFilter<$PrismaModel> | $Enums.Regiao
  }

  export type CidadeListRelationFilter = {
    every?: CidadeWhereInput
    some?: CidadeWhereInput
    none?: CidadeWhereInput
  }

  export type CidadeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UnidadeFederativaCountOrderByAggregateInput = {
    sigla?: SortOrder
    nome?: SortOrder
    regiao?: SortOrder
  }

  export type UnidadeFederativaMaxOrderByAggregateInput = {
    sigla?: SortOrder
    nome?: SortOrder
    regiao?: SortOrder
  }

  export type UnidadeFederativaMinOrderByAggregateInput = {
    sigla?: SortOrder
    nome?: SortOrder
    regiao?: SortOrder
  }

  export type EnumSiglaUFWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SiglaUF | EnumSiglaUFFieldRefInput<$PrismaModel>
    in?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    not?: NestedEnumSiglaUFWithAggregatesFilter<$PrismaModel> | $Enums.SiglaUF
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSiglaUFFilter<$PrismaModel>
    _max?: NestedEnumSiglaUFFilter<$PrismaModel>
  }

  export type EnumRegiaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Regiao | EnumRegiaoFieldRefInput<$PrismaModel>
    in?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    not?: NestedEnumRegiaoWithAggregatesFilter<$PrismaModel> | $Enums.Regiao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRegiaoFilter<$PrismaModel>
    _max?: NestedEnumRegiaoFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UnidadeFederativaScalarRelationFilter = {
    is?: UnidadeFederativaWhereInput
    isNot?: UnidadeFederativaWhereInput
  }

  export type BairroListRelationFilter = {
    every?: BairroWhereInput
    some?: BairroWhereInput
    none?: BairroWhereInput
  }

  export type BairroOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CidadeUf_siglaNomeCompoundUniqueInput = {
    uf_sigla: $Enums.SiglaUF
    nome: string
  }

  export type CidadeCountOrderByAggregateInput = {
    id?: SortOrder
    uf_sigla?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    padrao?: SortOrder
  }

  export type CidadeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CidadeMaxOrderByAggregateInput = {
    id?: SortOrder
    uf_sigla?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    padrao?: SortOrder
  }

  export type CidadeMinOrderByAggregateInput = {
    id?: SortOrder
    uf_sigla?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    padrao?: SortOrder
  }

  export type CidadeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type CidadeScalarRelationFilter = {
    is?: CidadeWhereInput
    isNot?: CidadeWhereInput
  }

  export type LogradouroListRelationFilter = {
    every?: LogradouroWhereInput
    some?: LogradouroWhereInput
    none?: LogradouroWhereInput
  }

  export type LogradouroOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BairroCidade_idNomeCompoundUniqueInput = {
    cidade_id: number
    nome: string
  }

  export type BairroCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade_id?: SortOrder
  }

  export type BairroAvgOrderByAggregateInput = {
    id?: SortOrder
    cidade_id?: SortOrder
  }

  export type BairroMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade_id?: SortOrder
  }

  export type BairroMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade_id?: SortOrder
  }

  export type BairroSumOrderByAggregateInput = {
    id?: SortOrder
    cidade_id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type BairroScalarRelationFilter = {
    is?: BairroWhereInput
    isNot?: BairroWhereInput
  }

  export type EnderecoListRelationFilter = {
    every?: EnderecoWhereInput
    some?: EnderecoWhereInput
    none?: EnderecoWhereInput
  }

  export type EnderecoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LogradouroBairro_idNomeCompoundUniqueInput = {
    bairro_id: bigint | number
    nome: string
  }

  export type LogradouroCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    bairro_id?: SortOrder
    tipo?: SortOrder
  }

  export type LogradouroAvgOrderByAggregateInput = {
    id?: SortOrder
    bairro_id?: SortOrder
  }

  export type LogradouroMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    bairro_id?: SortOrder
    tipo?: SortOrder
  }

  export type LogradouroMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cep?: SortOrder
    bairro_id?: SortOrder
    tipo?: SortOrder
  }

  export type LogradouroSumOrderByAggregateInput = {
    id?: SortOrder
    bairro_id?: SortOrder
  }

  export type ProfissionalNullableScalarRelationFilter = {
    is?: ProfissionalWhereInput | null
    isNot?: ProfissionalWhereInput | null
  }

  export type Servico_clienteListRelationFilter = {
    every?: servico_clienteWhereInput
    some?: servico_clienteWhereInput
    none?: servico_clienteWhereInput
  }

  export type servico_clienteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PessoaCountOrderByAggregateInput = {
    id?: SortOrder
    cpf?: SortOrder
    nascimento?: SortOrder
    celular?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type PessoaMaxOrderByAggregateInput = {
    id?: SortOrder
    cpf?: SortOrder
    nascimento?: SortOrder
    celular?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type PessoaMinOrderByAggregateInput = {
    id?: SortOrder
    cpf?: SortOrder
    nascimento?: SortOrder
    celular?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type LogradouroScalarRelationFilter = {
    is?: LogradouroWhereInput
    isNot?: LogradouroWhereInput
  }

  export type PessoaScalarRelationFilter = {
    is?: PessoaWhereInput
    isNot?: PessoaWhereInput
  }

  export type EnderecoPessoa_idLogradouro_idNumeroCompoundUniqueInput = {
    pessoa_id: string
    logradouro_id: bigint | number
    numero: string
  }

  export type EnderecoCountOrderByAggregateInput = {
    logradouro_id?: SortOrder
    pessoa_id?: SortOrder
    numero?: SortOrder
    complemento?: SortOrder
    referencia?: SortOrder
  }

  export type EnderecoAvgOrderByAggregateInput = {
    logradouro_id?: SortOrder
  }

  export type EnderecoMaxOrderByAggregateInput = {
    logradouro_id?: SortOrder
    pessoa_id?: SortOrder
    numero?: SortOrder
    complemento?: SortOrder
    referencia?: SortOrder
  }

  export type EnderecoMinOrderByAggregateInput = {
    logradouro_id?: SortOrder
    pessoa_id?: SortOrder
    numero?: SortOrder
    complemento?: SortOrder
    referencia?: SortOrder
  }

  export type EnderecoSumOrderByAggregateInput = {
    logradouro_id?: SortOrder
  }

  export type ProfissionalCountOrderByAggregateInput = {
    pessoa_id?: SortOrder
    titulo?: SortOrder
  }

  export type ProfissionalMaxOrderByAggregateInput = {
    pessoa_id?: SortOrder
    titulo?: SortOrder
  }

  export type ProfissionalMinOrderByAggregateInput = {
    pessoa_id?: SortOrder
    titulo?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type Enumenum_servico_cliente_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.enum_servico_cliente_status | Enumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel> | $Enums.enum_servico_cliente_status | null
  }

  export type Servico_cliente_fotoListRelationFilter = {
    every?: servico_cliente_fotoWhereInput
    some?: servico_cliente_fotoWhereInput
    none?: servico_cliente_fotoWhereInput
  }

  export type servico_cliente_fotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type servico_clienteCountOrderByAggregateInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data_hora_agendamento?: SortOrder
    valor_oferecido?: SortOrder
    status?: SortOrder
    criado_em?: SortOrder
  }

  export type servico_clienteAvgOrderByAggregateInput = {
    id?: SortOrder
    valor_oferecido?: SortOrder
  }

  export type servico_clienteMaxOrderByAggregateInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data_hora_agendamento?: SortOrder
    valor_oferecido?: SortOrder
    status?: SortOrder
    criado_em?: SortOrder
  }

  export type servico_clienteMinOrderByAggregateInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data_hora_agendamento?: SortOrder
    valor_oferecido?: SortOrder
    status?: SortOrder
    criado_em?: SortOrder
  }

  export type servico_clienteSumOrderByAggregateInput = {
    id?: SortOrder
    valor_oferecido?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type Enumenum_servico_cliente_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.enum_servico_cliente_status | Enumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumenum_servico_cliente_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.enum_servico_cliente_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel>
  }

  export type Servico_clienteScalarRelationFilter = {
    is?: servico_clienteWhereInput
    isNot?: servico_clienteWhereInput
  }

  export type servico_cliente_fotoServico_cliente_idMd5CompoundUniqueInput = {
    servico_cliente_id: bigint | number
    md5: string
  }

  export type servico_cliente_fotoCountOrderByAggregateInput = {
    servico_cliente_id?: SortOrder
    md5?: SortOrder
    uri_img?: SortOrder
    ordem?: SortOrder
  }

  export type servico_cliente_fotoAvgOrderByAggregateInput = {
    servico_cliente_id?: SortOrder
    ordem?: SortOrder
  }

  export type servico_cliente_fotoMaxOrderByAggregateInput = {
    servico_cliente_id?: SortOrder
    md5?: SortOrder
    uri_img?: SortOrder
    ordem?: SortOrder
  }

  export type servico_cliente_fotoMinOrderByAggregateInput = {
    servico_cliente_id?: SortOrder
    md5?: SortOrder
    uri_img?: SortOrder
    ordem?: SortOrder
  }

  export type servico_cliente_fotoSumOrderByAggregateInput = {
    servico_cliente_id?: SortOrder
    ordem?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type PessoaCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<PessoaCreateWithoutUsuarioInput, PessoaUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutUsuarioInput
    connect?: PessoaWhereUniqueInput
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type PessoaUncheckedCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<PessoaCreateWithoutUsuarioInput, PessoaUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutUsuarioInput
    connect?: PessoaWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type PessoaUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<PessoaCreateWithoutUsuarioInput, PessoaUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutUsuarioInput
    upsert?: PessoaUpsertWithoutUsuarioInput
    disconnect?: PessoaWhereInput | boolean
    delete?: PessoaWhereInput | boolean
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutUsuarioInput, PessoaUpdateWithoutUsuarioInput>, PessoaUncheckedUpdateWithoutUsuarioInput>
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type PessoaUncheckedUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<PessoaCreateWithoutUsuarioInput, PessoaUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutUsuarioInput
    upsert?: PessoaUpsertWithoutUsuarioInput
    disconnect?: PessoaWhereInput | boolean
    delete?: PessoaWhereInput | boolean
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutUsuarioInput, PessoaUpdateWithoutUsuarioInput>, PessoaUncheckedUpdateWithoutUsuarioInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type CidadeCreateNestedManyWithoutUfInput = {
    create?: XOR<CidadeCreateWithoutUfInput, CidadeUncheckedCreateWithoutUfInput> | CidadeCreateWithoutUfInput[] | CidadeUncheckedCreateWithoutUfInput[]
    connectOrCreate?: CidadeCreateOrConnectWithoutUfInput | CidadeCreateOrConnectWithoutUfInput[]
    createMany?: CidadeCreateManyUfInputEnvelope
    connect?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
  }

  export type CidadeUncheckedCreateNestedManyWithoutUfInput = {
    create?: XOR<CidadeCreateWithoutUfInput, CidadeUncheckedCreateWithoutUfInput> | CidadeCreateWithoutUfInput[] | CidadeUncheckedCreateWithoutUfInput[]
    connectOrCreate?: CidadeCreateOrConnectWithoutUfInput | CidadeCreateOrConnectWithoutUfInput[]
    createMany?: CidadeCreateManyUfInputEnvelope
    connect?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
  }

  export type EnumSiglaUFFieldUpdateOperationsInput = {
    set?: $Enums.SiglaUF
  }

  export type EnumRegiaoFieldUpdateOperationsInput = {
    set?: $Enums.Regiao
  }

  export type CidadeUpdateManyWithoutUfNestedInput = {
    create?: XOR<CidadeCreateWithoutUfInput, CidadeUncheckedCreateWithoutUfInput> | CidadeCreateWithoutUfInput[] | CidadeUncheckedCreateWithoutUfInput[]
    connectOrCreate?: CidadeCreateOrConnectWithoutUfInput | CidadeCreateOrConnectWithoutUfInput[]
    upsert?: CidadeUpsertWithWhereUniqueWithoutUfInput | CidadeUpsertWithWhereUniqueWithoutUfInput[]
    createMany?: CidadeCreateManyUfInputEnvelope
    set?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    disconnect?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    delete?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    connect?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    update?: CidadeUpdateWithWhereUniqueWithoutUfInput | CidadeUpdateWithWhereUniqueWithoutUfInput[]
    updateMany?: CidadeUpdateManyWithWhereWithoutUfInput | CidadeUpdateManyWithWhereWithoutUfInput[]
    deleteMany?: CidadeScalarWhereInput | CidadeScalarWhereInput[]
  }

  export type CidadeUncheckedUpdateManyWithoutUfNestedInput = {
    create?: XOR<CidadeCreateWithoutUfInput, CidadeUncheckedCreateWithoutUfInput> | CidadeCreateWithoutUfInput[] | CidadeUncheckedCreateWithoutUfInput[]
    connectOrCreate?: CidadeCreateOrConnectWithoutUfInput | CidadeCreateOrConnectWithoutUfInput[]
    upsert?: CidadeUpsertWithWhereUniqueWithoutUfInput | CidadeUpsertWithWhereUniqueWithoutUfInput[]
    createMany?: CidadeCreateManyUfInputEnvelope
    set?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    disconnect?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    delete?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    connect?: CidadeWhereUniqueInput | CidadeWhereUniqueInput[]
    update?: CidadeUpdateWithWhereUniqueWithoutUfInput | CidadeUpdateWithWhereUniqueWithoutUfInput[]
    updateMany?: CidadeUpdateManyWithWhereWithoutUfInput | CidadeUpdateManyWithWhereWithoutUfInput[]
    deleteMany?: CidadeScalarWhereInput | CidadeScalarWhereInput[]
  }

  export type UnidadeFederativaCreateNestedOneWithoutCidadesInput = {
    create?: XOR<UnidadeFederativaCreateWithoutCidadesInput, UnidadeFederativaUncheckedCreateWithoutCidadesInput>
    connectOrCreate?: UnidadeFederativaCreateOrConnectWithoutCidadesInput
    connect?: UnidadeFederativaWhereUniqueInput
  }

  export type BairroCreateNestedManyWithoutCidadeInput = {
    create?: XOR<BairroCreateWithoutCidadeInput, BairroUncheckedCreateWithoutCidadeInput> | BairroCreateWithoutCidadeInput[] | BairroUncheckedCreateWithoutCidadeInput[]
    connectOrCreate?: BairroCreateOrConnectWithoutCidadeInput | BairroCreateOrConnectWithoutCidadeInput[]
    createMany?: BairroCreateManyCidadeInputEnvelope
    connect?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
  }

  export type BairroUncheckedCreateNestedManyWithoutCidadeInput = {
    create?: XOR<BairroCreateWithoutCidadeInput, BairroUncheckedCreateWithoutCidadeInput> | BairroCreateWithoutCidadeInput[] | BairroUncheckedCreateWithoutCidadeInput[]
    connectOrCreate?: BairroCreateOrConnectWithoutCidadeInput | BairroCreateOrConnectWithoutCidadeInput[]
    createMany?: BairroCreateManyCidadeInputEnvelope
    connect?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
  }

  export type UnidadeFederativaUpdateOneRequiredWithoutCidadesNestedInput = {
    create?: XOR<UnidadeFederativaCreateWithoutCidadesInput, UnidadeFederativaUncheckedCreateWithoutCidadesInput>
    connectOrCreate?: UnidadeFederativaCreateOrConnectWithoutCidadesInput
    upsert?: UnidadeFederativaUpsertWithoutCidadesInput
    connect?: UnidadeFederativaWhereUniqueInput
    update?: XOR<XOR<UnidadeFederativaUpdateToOneWithWhereWithoutCidadesInput, UnidadeFederativaUpdateWithoutCidadesInput>, UnidadeFederativaUncheckedUpdateWithoutCidadesInput>
  }

  export type BairroUpdateManyWithoutCidadeNestedInput = {
    create?: XOR<BairroCreateWithoutCidadeInput, BairroUncheckedCreateWithoutCidadeInput> | BairroCreateWithoutCidadeInput[] | BairroUncheckedCreateWithoutCidadeInput[]
    connectOrCreate?: BairroCreateOrConnectWithoutCidadeInput | BairroCreateOrConnectWithoutCidadeInput[]
    upsert?: BairroUpsertWithWhereUniqueWithoutCidadeInput | BairroUpsertWithWhereUniqueWithoutCidadeInput[]
    createMany?: BairroCreateManyCidadeInputEnvelope
    set?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    disconnect?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    delete?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    connect?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    update?: BairroUpdateWithWhereUniqueWithoutCidadeInput | BairroUpdateWithWhereUniqueWithoutCidadeInput[]
    updateMany?: BairroUpdateManyWithWhereWithoutCidadeInput | BairroUpdateManyWithWhereWithoutCidadeInput[]
    deleteMany?: BairroScalarWhereInput | BairroScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BairroUncheckedUpdateManyWithoutCidadeNestedInput = {
    create?: XOR<BairroCreateWithoutCidadeInput, BairroUncheckedCreateWithoutCidadeInput> | BairroCreateWithoutCidadeInput[] | BairroUncheckedCreateWithoutCidadeInput[]
    connectOrCreate?: BairroCreateOrConnectWithoutCidadeInput | BairroCreateOrConnectWithoutCidadeInput[]
    upsert?: BairroUpsertWithWhereUniqueWithoutCidadeInput | BairroUpsertWithWhereUniqueWithoutCidadeInput[]
    createMany?: BairroCreateManyCidadeInputEnvelope
    set?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    disconnect?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    delete?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    connect?: BairroWhereUniqueInput | BairroWhereUniqueInput[]
    update?: BairroUpdateWithWhereUniqueWithoutCidadeInput | BairroUpdateWithWhereUniqueWithoutCidadeInput[]
    updateMany?: BairroUpdateManyWithWhereWithoutCidadeInput | BairroUpdateManyWithWhereWithoutCidadeInput[]
    deleteMany?: BairroScalarWhereInput | BairroScalarWhereInput[]
  }

  export type CidadeCreateNestedOneWithoutBairrosInput = {
    create?: XOR<CidadeCreateWithoutBairrosInput, CidadeUncheckedCreateWithoutBairrosInput>
    connectOrCreate?: CidadeCreateOrConnectWithoutBairrosInput
    connect?: CidadeWhereUniqueInput
  }

  export type LogradouroCreateNestedManyWithoutBairroInput = {
    create?: XOR<LogradouroCreateWithoutBairroInput, LogradouroUncheckedCreateWithoutBairroInput> | LogradouroCreateWithoutBairroInput[] | LogradouroUncheckedCreateWithoutBairroInput[]
    connectOrCreate?: LogradouroCreateOrConnectWithoutBairroInput | LogradouroCreateOrConnectWithoutBairroInput[]
    createMany?: LogradouroCreateManyBairroInputEnvelope
    connect?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
  }

  export type LogradouroUncheckedCreateNestedManyWithoutBairroInput = {
    create?: XOR<LogradouroCreateWithoutBairroInput, LogradouroUncheckedCreateWithoutBairroInput> | LogradouroCreateWithoutBairroInput[] | LogradouroUncheckedCreateWithoutBairroInput[]
    connectOrCreate?: LogradouroCreateOrConnectWithoutBairroInput | LogradouroCreateOrConnectWithoutBairroInput[]
    createMany?: LogradouroCreateManyBairroInputEnvelope
    connect?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type CidadeUpdateOneRequiredWithoutBairrosNestedInput = {
    create?: XOR<CidadeCreateWithoutBairrosInput, CidadeUncheckedCreateWithoutBairrosInput>
    connectOrCreate?: CidadeCreateOrConnectWithoutBairrosInput
    upsert?: CidadeUpsertWithoutBairrosInput
    connect?: CidadeWhereUniqueInput
    update?: XOR<XOR<CidadeUpdateToOneWithWhereWithoutBairrosInput, CidadeUpdateWithoutBairrosInput>, CidadeUncheckedUpdateWithoutBairrosInput>
  }

  export type LogradouroUpdateManyWithoutBairroNestedInput = {
    create?: XOR<LogradouroCreateWithoutBairroInput, LogradouroUncheckedCreateWithoutBairroInput> | LogradouroCreateWithoutBairroInput[] | LogradouroUncheckedCreateWithoutBairroInput[]
    connectOrCreate?: LogradouroCreateOrConnectWithoutBairroInput | LogradouroCreateOrConnectWithoutBairroInput[]
    upsert?: LogradouroUpsertWithWhereUniqueWithoutBairroInput | LogradouroUpsertWithWhereUniqueWithoutBairroInput[]
    createMany?: LogradouroCreateManyBairroInputEnvelope
    set?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    disconnect?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    delete?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    connect?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    update?: LogradouroUpdateWithWhereUniqueWithoutBairroInput | LogradouroUpdateWithWhereUniqueWithoutBairroInput[]
    updateMany?: LogradouroUpdateManyWithWhereWithoutBairroInput | LogradouroUpdateManyWithWhereWithoutBairroInput[]
    deleteMany?: LogradouroScalarWhereInput | LogradouroScalarWhereInput[]
  }

  export type LogradouroUncheckedUpdateManyWithoutBairroNestedInput = {
    create?: XOR<LogradouroCreateWithoutBairroInput, LogradouroUncheckedCreateWithoutBairroInput> | LogradouroCreateWithoutBairroInput[] | LogradouroUncheckedCreateWithoutBairroInput[]
    connectOrCreate?: LogradouroCreateOrConnectWithoutBairroInput | LogradouroCreateOrConnectWithoutBairroInput[]
    upsert?: LogradouroUpsertWithWhereUniqueWithoutBairroInput | LogradouroUpsertWithWhereUniqueWithoutBairroInput[]
    createMany?: LogradouroCreateManyBairroInputEnvelope
    set?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    disconnect?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    delete?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    connect?: LogradouroWhereUniqueInput | LogradouroWhereUniqueInput[]
    update?: LogradouroUpdateWithWhereUniqueWithoutBairroInput | LogradouroUpdateWithWhereUniqueWithoutBairroInput[]
    updateMany?: LogradouroUpdateManyWithWhereWithoutBairroInput | LogradouroUpdateManyWithWhereWithoutBairroInput[]
    deleteMany?: LogradouroScalarWhereInput | LogradouroScalarWhereInput[]
  }

  export type BairroCreateNestedOneWithoutLogradouroInput = {
    create?: XOR<BairroCreateWithoutLogradouroInput, BairroUncheckedCreateWithoutLogradouroInput>
    connectOrCreate?: BairroCreateOrConnectWithoutLogradouroInput
    connect?: BairroWhereUniqueInput
  }

  export type EnderecoCreateNestedManyWithoutLogradouroInput = {
    create?: XOR<EnderecoCreateWithoutLogradouroInput, EnderecoUncheckedCreateWithoutLogradouroInput> | EnderecoCreateWithoutLogradouroInput[] | EnderecoUncheckedCreateWithoutLogradouroInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutLogradouroInput | EnderecoCreateOrConnectWithoutLogradouroInput[]
    createMany?: EnderecoCreateManyLogradouroInputEnvelope
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
  }

  export type EnderecoUncheckedCreateNestedManyWithoutLogradouroInput = {
    create?: XOR<EnderecoCreateWithoutLogradouroInput, EnderecoUncheckedCreateWithoutLogradouroInput> | EnderecoCreateWithoutLogradouroInput[] | EnderecoUncheckedCreateWithoutLogradouroInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutLogradouroInput | EnderecoCreateOrConnectWithoutLogradouroInput[]
    createMany?: EnderecoCreateManyLogradouroInputEnvelope
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
  }

  export type BairroUpdateOneRequiredWithoutLogradouroNestedInput = {
    create?: XOR<BairroCreateWithoutLogradouroInput, BairroUncheckedCreateWithoutLogradouroInput>
    connectOrCreate?: BairroCreateOrConnectWithoutLogradouroInput
    upsert?: BairroUpsertWithoutLogradouroInput
    connect?: BairroWhereUniqueInput
    update?: XOR<XOR<BairroUpdateToOneWithWhereWithoutLogradouroInput, BairroUpdateWithoutLogradouroInput>, BairroUncheckedUpdateWithoutLogradouroInput>
  }

  export type EnderecoUpdateManyWithoutLogradouroNestedInput = {
    create?: XOR<EnderecoCreateWithoutLogradouroInput, EnderecoUncheckedCreateWithoutLogradouroInput> | EnderecoCreateWithoutLogradouroInput[] | EnderecoUncheckedCreateWithoutLogradouroInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutLogradouroInput | EnderecoCreateOrConnectWithoutLogradouroInput[]
    upsert?: EnderecoUpsertWithWhereUniqueWithoutLogradouroInput | EnderecoUpsertWithWhereUniqueWithoutLogradouroInput[]
    createMany?: EnderecoCreateManyLogradouroInputEnvelope
    set?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    disconnect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    delete?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    update?: EnderecoUpdateWithWhereUniqueWithoutLogradouroInput | EnderecoUpdateWithWhereUniqueWithoutLogradouroInput[]
    updateMany?: EnderecoUpdateManyWithWhereWithoutLogradouroInput | EnderecoUpdateManyWithWhereWithoutLogradouroInput[]
    deleteMany?: EnderecoScalarWhereInput | EnderecoScalarWhereInput[]
  }

  export type EnderecoUncheckedUpdateManyWithoutLogradouroNestedInput = {
    create?: XOR<EnderecoCreateWithoutLogradouroInput, EnderecoUncheckedCreateWithoutLogradouroInput> | EnderecoCreateWithoutLogradouroInput[] | EnderecoUncheckedCreateWithoutLogradouroInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutLogradouroInput | EnderecoCreateOrConnectWithoutLogradouroInput[]
    upsert?: EnderecoUpsertWithWhereUniqueWithoutLogradouroInput | EnderecoUpsertWithWhereUniqueWithoutLogradouroInput[]
    createMany?: EnderecoCreateManyLogradouroInputEnvelope
    set?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    disconnect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    delete?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    update?: EnderecoUpdateWithWhereUniqueWithoutLogradouroInput | EnderecoUpdateWithWhereUniqueWithoutLogradouroInput[]
    updateMany?: EnderecoUpdateManyWithWhereWithoutLogradouroInput | EnderecoUpdateManyWithWhereWithoutLogradouroInput[]
    deleteMany?: EnderecoScalarWhereInput | EnderecoScalarWhereInput[]
  }

  export type EnderecoCreateNestedManyWithoutPessoaInput = {
    create?: XOR<EnderecoCreateWithoutPessoaInput, EnderecoUncheckedCreateWithoutPessoaInput> | EnderecoCreateWithoutPessoaInput[] | EnderecoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutPessoaInput | EnderecoCreateOrConnectWithoutPessoaInput[]
    createMany?: EnderecoCreateManyPessoaInputEnvelope
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
  }

  export type ProfissionalCreateNestedOneWithoutPessoaInput = {
    create?: XOR<ProfissionalCreateWithoutPessoaInput, ProfissionalUncheckedCreateWithoutPessoaInput>
    connectOrCreate?: ProfissionalCreateOrConnectWithoutPessoaInput
    connect?: ProfissionalWhereUniqueInput
  }

  export type servico_clienteCreateNestedManyWithoutPessoaInput = {
    create?: XOR<servico_clienteCreateWithoutPessoaInput, servico_clienteUncheckedCreateWithoutPessoaInput> | servico_clienteCreateWithoutPessoaInput[] | servico_clienteUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: servico_clienteCreateOrConnectWithoutPessoaInput | servico_clienteCreateOrConnectWithoutPessoaInput[]
    createMany?: servico_clienteCreateManyPessoaInputEnvelope
    connect?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutPessoaInput = {
    create?: XOR<UserCreateWithoutPessoaInput, UserUncheckedCreateWithoutPessoaInput>
    connectOrCreate?: UserCreateOrConnectWithoutPessoaInput
    connect?: UserWhereUniqueInput
  }

  export type EnderecoUncheckedCreateNestedManyWithoutPessoaInput = {
    create?: XOR<EnderecoCreateWithoutPessoaInput, EnderecoUncheckedCreateWithoutPessoaInput> | EnderecoCreateWithoutPessoaInput[] | EnderecoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutPessoaInput | EnderecoCreateOrConnectWithoutPessoaInput[]
    createMany?: EnderecoCreateManyPessoaInputEnvelope
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
  }

  export type ProfissionalUncheckedCreateNestedOneWithoutPessoaInput = {
    create?: XOR<ProfissionalCreateWithoutPessoaInput, ProfissionalUncheckedCreateWithoutPessoaInput>
    connectOrCreate?: ProfissionalCreateOrConnectWithoutPessoaInput
    connect?: ProfissionalWhereUniqueInput
  }

  export type servico_clienteUncheckedCreateNestedManyWithoutPessoaInput = {
    create?: XOR<servico_clienteCreateWithoutPessoaInput, servico_clienteUncheckedCreateWithoutPessoaInput> | servico_clienteCreateWithoutPessoaInput[] | servico_clienteUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: servico_clienteCreateOrConnectWithoutPessoaInput | servico_clienteCreateOrConnectWithoutPessoaInput[]
    createMany?: servico_clienteCreateManyPessoaInputEnvelope
    connect?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
  }

  export type EnderecoUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<EnderecoCreateWithoutPessoaInput, EnderecoUncheckedCreateWithoutPessoaInput> | EnderecoCreateWithoutPessoaInput[] | EnderecoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutPessoaInput | EnderecoCreateOrConnectWithoutPessoaInput[]
    upsert?: EnderecoUpsertWithWhereUniqueWithoutPessoaInput | EnderecoUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: EnderecoCreateManyPessoaInputEnvelope
    set?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    disconnect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    delete?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    update?: EnderecoUpdateWithWhereUniqueWithoutPessoaInput | EnderecoUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: EnderecoUpdateManyWithWhereWithoutPessoaInput | EnderecoUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: EnderecoScalarWhereInput | EnderecoScalarWhereInput[]
  }

  export type ProfissionalUpdateOneWithoutPessoaNestedInput = {
    create?: XOR<ProfissionalCreateWithoutPessoaInput, ProfissionalUncheckedCreateWithoutPessoaInput>
    connectOrCreate?: ProfissionalCreateOrConnectWithoutPessoaInput
    upsert?: ProfissionalUpsertWithoutPessoaInput
    disconnect?: ProfissionalWhereInput | boolean
    delete?: ProfissionalWhereInput | boolean
    connect?: ProfissionalWhereUniqueInput
    update?: XOR<XOR<ProfissionalUpdateToOneWithWhereWithoutPessoaInput, ProfissionalUpdateWithoutPessoaInput>, ProfissionalUncheckedUpdateWithoutPessoaInput>
  }

  export type servico_clienteUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<servico_clienteCreateWithoutPessoaInput, servico_clienteUncheckedCreateWithoutPessoaInput> | servico_clienteCreateWithoutPessoaInput[] | servico_clienteUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: servico_clienteCreateOrConnectWithoutPessoaInput | servico_clienteCreateOrConnectWithoutPessoaInput[]
    upsert?: servico_clienteUpsertWithWhereUniqueWithoutPessoaInput | servico_clienteUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: servico_clienteCreateManyPessoaInputEnvelope
    set?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    disconnect?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    delete?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    connect?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    update?: servico_clienteUpdateWithWhereUniqueWithoutPessoaInput | servico_clienteUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: servico_clienteUpdateManyWithWhereWithoutPessoaInput | servico_clienteUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: servico_clienteScalarWhereInput | servico_clienteScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutPessoaNestedInput = {
    create?: XOR<UserCreateWithoutPessoaInput, UserUncheckedCreateWithoutPessoaInput>
    connectOrCreate?: UserCreateOrConnectWithoutPessoaInput
    upsert?: UserUpsertWithoutPessoaInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPessoaInput, UserUpdateWithoutPessoaInput>, UserUncheckedUpdateWithoutPessoaInput>
  }

  export type EnderecoUncheckedUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<EnderecoCreateWithoutPessoaInput, EnderecoUncheckedCreateWithoutPessoaInput> | EnderecoCreateWithoutPessoaInput[] | EnderecoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: EnderecoCreateOrConnectWithoutPessoaInput | EnderecoCreateOrConnectWithoutPessoaInput[]
    upsert?: EnderecoUpsertWithWhereUniqueWithoutPessoaInput | EnderecoUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: EnderecoCreateManyPessoaInputEnvelope
    set?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    disconnect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    delete?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    connect?: EnderecoWhereUniqueInput | EnderecoWhereUniqueInput[]
    update?: EnderecoUpdateWithWhereUniqueWithoutPessoaInput | EnderecoUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: EnderecoUpdateManyWithWhereWithoutPessoaInput | EnderecoUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: EnderecoScalarWhereInput | EnderecoScalarWhereInput[]
  }

  export type ProfissionalUncheckedUpdateOneWithoutPessoaNestedInput = {
    create?: XOR<ProfissionalCreateWithoutPessoaInput, ProfissionalUncheckedCreateWithoutPessoaInput>
    connectOrCreate?: ProfissionalCreateOrConnectWithoutPessoaInput
    upsert?: ProfissionalUpsertWithoutPessoaInput
    disconnect?: ProfissionalWhereInput | boolean
    delete?: ProfissionalWhereInput | boolean
    connect?: ProfissionalWhereUniqueInput
    update?: XOR<XOR<ProfissionalUpdateToOneWithWhereWithoutPessoaInput, ProfissionalUpdateWithoutPessoaInput>, ProfissionalUncheckedUpdateWithoutPessoaInput>
  }

  export type servico_clienteUncheckedUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<servico_clienteCreateWithoutPessoaInput, servico_clienteUncheckedCreateWithoutPessoaInput> | servico_clienteCreateWithoutPessoaInput[] | servico_clienteUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: servico_clienteCreateOrConnectWithoutPessoaInput | servico_clienteCreateOrConnectWithoutPessoaInput[]
    upsert?: servico_clienteUpsertWithWhereUniqueWithoutPessoaInput | servico_clienteUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: servico_clienteCreateManyPessoaInputEnvelope
    set?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    disconnect?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    delete?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    connect?: servico_clienteWhereUniqueInput | servico_clienteWhereUniqueInput[]
    update?: servico_clienteUpdateWithWhereUniqueWithoutPessoaInput | servico_clienteUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: servico_clienteUpdateManyWithWhereWithoutPessoaInput | servico_clienteUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: servico_clienteScalarWhereInput | servico_clienteScalarWhereInput[]
  }

  export type LogradouroCreateNestedOneWithoutEnderecosInput = {
    create?: XOR<LogradouroCreateWithoutEnderecosInput, LogradouroUncheckedCreateWithoutEnderecosInput>
    connectOrCreate?: LogradouroCreateOrConnectWithoutEnderecosInput
    connect?: LogradouroWhereUniqueInput
  }

  export type PessoaCreateNestedOneWithoutEnderecosInput = {
    create?: XOR<PessoaCreateWithoutEnderecosInput, PessoaUncheckedCreateWithoutEnderecosInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutEnderecosInput
    connect?: PessoaWhereUniqueInput
  }

  export type LogradouroUpdateOneRequiredWithoutEnderecosNestedInput = {
    create?: XOR<LogradouroCreateWithoutEnderecosInput, LogradouroUncheckedCreateWithoutEnderecosInput>
    connectOrCreate?: LogradouroCreateOrConnectWithoutEnderecosInput
    upsert?: LogradouroUpsertWithoutEnderecosInput
    connect?: LogradouroWhereUniqueInput
    update?: XOR<XOR<LogradouroUpdateToOneWithWhereWithoutEnderecosInput, LogradouroUpdateWithoutEnderecosInput>, LogradouroUncheckedUpdateWithoutEnderecosInput>
  }

  export type PessoaUpdateOneRequiredWithoutEnderecosNestedInput = {
    create?: XOR<PessoaCreateWithoutEnderecosInput, PessoaUncheckedCreateWithoutEnderecosInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutEnderecosInput
    upsert?: PessoaUpsertWithoutEnderecosInput
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutEnderecosInput, PessoaUpdateWithoutEnderecosInput>, PessoaUncheckedUpdateWithoutEnderecosInput>
  }

  export type PessoaCreateNestedOneWithoutProfissionalInput = {
    create?: XOR<PessoaCreateWithoutProfissionalInput, PessoaUncheckedCreateWithoutProfissionalInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutProfissionalInput
    connect?: PessoaWhereUniqueInput
  }

  export type PessoaUpdateOneRequiredWithoutProfissionalNestedInput = {
    create?: XOR<PessoaCreateWithoutProfissionalInput, PessoaUncheckedCreateWithoutProfissionalInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutProfissionalInput
    upsert?: PessoaUpsertWithoutProfissionalInput
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutProfissionalInput, PessoaUpdateWithoutProfissionalInput>, PessoaUncheckedUpdateWithoutProfissionalInput>
  }

  export type PessoaCreateNestedOneWithoutServico_clienteInput = {
    create?: XOR<PessoaCreateWithoutServico_clienteInput, PessoaUncheckedCreateWithoutServico_clienteInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutServico_clienteInput
    connect?: PessoaWhereUniqueInput
  }

  export type servico_cliente_fotoCreateNestedManyWithoutServico_clienteInput = {
    create?: XOR<servico_cliente_fotoCreateWithoutServico_clienteInput, servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput> | servico_cliente_fotoCreateWithoutServico_clienteInput[] | servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput[]
    connectOrCreate?: servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput | servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput[]
    createMany?: servico_cliente_fotoCreateManyServico_clienteInputEnvelope
    connect?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
  }

  export type servico_cliente_fotoUncheckedCreateNestedManyWithoutServico_clienteInput = {
    create?: XOR<servico_cliente_fotoCreateWithoutServico_clienteInput, servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput> | servico_cliente_fotoCreateWithoutServico_clienteInput[] | servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput[]
    connectOrCreate?: servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput | servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput[]
    createMany?: servico_cliente_fotoCreateManyServico_clienteInputEnvelope
    connect?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput = {
    set?: $Enums.enum_servico_cliente_status | null
  }

  export type PessoaUpdateOneRequiredWithoutServico_clienteNestedInput = {
    create?: XOR<PessoaCreateWithoutServico_clienteInput, PessoaUncheckedCreateWithoutServico_clienteInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutServico_clienteInput
    upsert?: PessoaUpsertWithoutServico_clienteInput
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutServico_clienteInput, PessoaUpdateWithoutServico_clienteInput>, PessoaUncheckedUpdateWithoutServico_clienteInput>
  }

  export type servico_cliente_fotoUpdateManyWithoutServico_clienteNestedInput = {
    create?: XOR<servico_cliente_fotoCreateWithoutServico_clienteInput, servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput> | servico_cliente_fotoCreateWithoutServico_clienteInput[] | servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput[]
    connectOrCreate?: servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput | servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput[]
    upsert?: servico_cliente_fotoUpsertWithWhereUniqueWithoutServico_clienteInput | servico_cliente_fotoUpsertWithWhereUniqueWithoutServico_clienteInput[]
    createMany?: servico_cliente_fotoCreateManyServico_clienteInputEnvelope
    set?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    disconnect?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    delete?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    connect?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    update?: servico_cliente_fotoUpdateWithWhereUniqueWithoutServico_clienteInput | servico_cliente_fotoUpdateWithWhereUniqueWithoutServico_clienteInput[]
    updateMany?: servico_cliente_fotoUpdateManyWithWhereWithoutServico_clienteInput | servico_cliente_fotoUpdateManyWithWhereWithoutServico_clienteInput[]
    deleteMany?: servico_cliente_fotoScalarWhereInput | servico_cliente_fotoScalarWhereInput[]
  }

  export type servico_cliente_fotoUncheckedUpdateManyWithoutServico_clienteNestedInput = {
    create?: XOR<servico_cliente_fotoCreateWithoutServico_clienteInput, servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput> | servico_cliente_fotoCreateWithoutServico_clienteInput[] | servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput[]
    connectOrCreate?: servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput | servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput[]
    upsert?: servico_cliente_fotoUpsertWithWhereUniqueWithoutServico_clienteInput | servico_cliente_fotoUpsertWithWhereUniqueWithoutServico_clienteInput[]
    createMany?: servico_cliente_fotoCreateManyServico_clienteInputEnvelope
    set?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    disconnect?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    delete?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    connect?: servico_cliente_fotoWhereUniqueInput | servico_cliente_fotoWhereUniqueInput[]
    update?: servico_cliente_fotoUpdateWithWhereUniqueWithoutServico_clienteInput | servico_cliente_fotoUpdateWithWhereUniqueWithoutServico_clienteInput[]
    updateMany?: servico_cliente_fotoUpdateManyWithWhereWithoutServico_clienteInput | servico_cliente_fotoUpdateManyWithWhereWithoutServico_clienteInput[]
    deleteMany?: servico_cliente_fotoScalarWhereInput | servico_cliente_fotoScalarWhereInput[]
  }

  export type servico_clienteCreateNestedOneWithoutFotosInput = {
    create?: XOR<servico_clienteCreateWithoutFotosInput, servico_clienteUncheckedCreateWithoutFotosInput>
    connectOrCreate?: servico_clienteCreateOrConnectWithoutFotosInput
    connect?: servico_clienteWhereUniqueInput
  }

  export type servico_clienteUpdateOneRequiredWithoutFotosNestedInput = {
    create?: XOR<servico_clienteCreateWithoutFotosInput, servico_clienteUncheckedCreateWithoutFotosInput>
    connectOrCreate?: servico_clienteCreateOrConnectWithoutFotosInput
    upsert?: servico_clienteUpsertWithoutFotosInput
    connect?: servico_clienteWhereUniqueInput
    update?: XOR<XOR<servico_clienteUpdateToOneWithWhereWithoutFotosInput, servico_clienteUpdateWithoutFotosInput>, servico_clienteUncheckedUpdateWithoutFotosInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSiglaUFFilter<$PrismaModel = never> = {
    equals?: $Enums.SiglaUF | EnumSiglaUFFieldRefInput<$PrismaModel>
    in?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    not?: NestedEnumSiglaUFFilter<$PrismaModel> | $Enums.SiglaUF
  }

  export type NestedEnumRegiaoFilter<$PrismaModel = never> = {
    equals?: $Enums.Regiao | EnumRegiaoFieldRefInput<$PrismaModel>
    in?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    not?: NestedEnumRegiaoFilter<$PrismaModel> | $Enums.Regiao
  }

  export type NestedEnumSiglaUFWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SiglaUF | EnumSiglaUFFieldRefInput<$PrismaModel>
    in?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    notIn?: $Enums.SiglaUF[] | ListEnumSiglaUFFieldRefInput<$PrismaModel>
    not?: NestedEnumSiglaUFWithAggregatesFilter<$PrismaModel> | $Enums.SiglaUF
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSiglaUFFilter<$PrismaModel>
    _max?: NestedEnumSiglaUFFilter<$PrismaModel>
  }

  export type NestedEnumRegiaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Regiao | EnumRegiaoFieldRefInput<$PrismaModel>
    in?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Regiao[] | ListEnumRegiaoFieldRefInput<$PrismaModel>
    not?: NestedEnumRegiaoWithAggregatesFilter<$PrismaModel> | $Enums.Regiao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRegiaoFilter<$PrismaModel>
    _max?: NestedEnumRegiaoFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.enum_servico_cliente_status | Enumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel> | $Enums.enum_servico_cliente_status | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumenum_servico_cliente_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.enum_servico_cliente_status | Enumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.enum_servico_cliente_status[] | ListEnumenum_servico_cliente_statusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumenum_servico_cliente_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.enum_servico_cliente_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumenum_servico_cliente_statusNullableFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PessoaCreateWithoutUsuarioInput = {
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoCreateNestedManyWithoutPessoaInput
    profissional?: ProfissionalCreateNestedOneWithoutPessoaInput
    servico_cliente?: servico_clienteCreateNestedManyWithoutPessoaInput
  }

  export type PessoaUncheckedCreateWithoutUsuarioInput = {
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoUncheckedCreateNestedManyWithoutPessoaInput
    profissional?: ProfissionalUncheckedCreateNestedOneWithoutPessoaInput
    servico_cliente?: servico_clienteUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaCreateOrConnectWithoutUsuarioInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutUsuarioInput, PessoaUncheckedCreateWithoutUsuarioInput>
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type PessoaUpsertWithoutUsuarioInput = {
    update: XOR<PessoaUpdateWithoutUsuarioInput, PessoaUncheckedUpdateWithoutUsuarioInput>
    create: XOR<PessoaCreateWithoutUsuarioInput, PessoaUncheckedCreateWithoutUsuarioInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutUsuarioInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutUsuarioInput, PessoaUncheckedUpdateWithoutUsuarioInput>
  }

  export type PessoaUpdateWithoutUsuarioInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUpdateManyWithoutPessoaNestedInput
    profissional?: ProfissionalUpdateOneWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateWithoutUsuarioInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUncheckedUpdateManyWithoutPessoaNestedInput
    profissional?: ProfissionalUncheckedUpdateOneWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    pessoa?: PessoaCreateNestedOneWithoutUsuarioInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    pessoa?: PessoaUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    pessoa?: PessoaUpdateOneWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    pessoa?: PessoaUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    pessoa?: PessoaCreateNestedOneWithoutUsuarioInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    pessoa?: PessoaUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    pessoa?: PessoaUpdateOneWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    pessoa?: PessoaUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type CidadeCreateWithoutUfInput = {
    nome: string
    cep?: string | null
    padrao?: boolean
    bairros?: BairroCreateNestedManyWithoutCidadeInput
  }

  export type CidadeUncheckedCreateWithoutUfInput = {
    id?: number
    nome: string
    cep?: string | null
    padrao?: boolean
    bairros?: BairroUncheckedCreateNestedManyWithoutCidadeInput
  }

  export type CidadeCreateOrConnectWithoutUfInput = {
    where: CidadeWhereUniqueInput
    create: XOR<CidadeCreateWithoutUfInput, CidadeUncheckedCreateWithoutUfInput>
  }

  export type CidadeCreateManyUfInputEnvelope = {
    data: CidadeCreateManyUfInput | CidadeCreateManyUfInput[]
    skipDuplicates?: boolean
  }

  export type CidadeUpsertWithWhereUniqueWithoutUfInput = {
    where: CidadeWhereUniqueInput
    update: XOR<CidadeUpdateWithoutUfInput, CidadeUncheckedUpdateWithoutUfInput>
    create: XOR<CidadeCreateWithoutUfInput, CidadeUncheckedCreateWithoutUfInput>
  }

  export type CidadeUpdateWithWhereUniqueWithoutUfInput = {
    where: CidadeWhereUniqueInput
    data: XOR<CidadeUpdateWithoutUfInput, CidadeUncheckedUpdateWithoutUfInput>
  }

  export type CidadeUpdateManyWithWhereWithoutUfInput = {
    where: CidadeScalarWhereInput
    data: XOR<CidadeUpdateManyMutationInput, CidadeUncheckedUpdateManyWithoutUfInput>
  }

  export type CidadeScalarWhereInput = {
    AND?: CidadeScalarWhereInput | CidadeScalarWhereInput[]
    OR?: CidadeScalarWhereInput[]
    NOT?: CidadeScalarWhereInput | CidadeScalarWhereInput[]
    id?: IntFilter<"Cidade"> | number
    uf_sigla?: EnumSiglaUFFilter<"Cidade"> | $Enums.SiglaUF
    nome?: StringFilter<"Cidade"> | string
    cep?: StringNullableFilter<"Cidade"> | string | null
    padrao?: BoolFilter<"Cidade"> | boolean
  }

  export type UnidadeFederativaCreateWithoutCidadesInput = {
    sigla: $Enums.SiglaUF
    nome: string
    regiao: $Enums.Regiao
  }

  export type UnidadeFederativaUncheckedCreateWithoutCidadesInput = {
    sigla: $Enums.SiglaUF
    nome: string
    regiao: $Enums.Regiao
  }

  export type UnidadeFederativaCreateOrConnectWithoutCidadesInput = {
    where: UnidadeFederativaWhereUniqueInput
    create: XOR<UnidadeFederativaCreateWithoutCidadesInput, UnidadeFederativaUncheckedCreateWithoutCidadesInput>
  }

  export type BairroCreateWithoutCidadeInput = {
    id?: bigint | number
    nome: string
    logradouro?: LogradouroCreateNestedManyWithoutBairroInput
  }

  export type BairroUncheckedCreateWithoutCidadeInput = {
    id?: bigint | number
    nome: string
    logradouro?: LogradouroUncheckedCreateNestedManyWithoutBairroInput
  }

  export type BairroCreateOrConnectWithoutCidadeInput = {
    where: BairroWhereUniqueInput
    create: XOR<BairroCreateWithoutCidadeInput, BairroUncheckedCreateWithoutCidadeInput>
  }

  export type BairroCreateManyCidadeInputEnvelope = {
    data: BairroCreateManyCidadeInput | BairroCreateManyCidadeInput[]
    skipDuplicates?: boolean
  }

  export type UnidadeFederativaUpsertWithoutCidadesInput = {
    update: XOR<UnidadeFederativaUpdateWithoutCidadesInput, UnidadeFederativaUncheckedUpdateWithoutCidadesInput>
    create: XOR<UnidadeFederativaCreateWithoutCidadesInput, UnidadeFederativaUncheckedCreateWithoutCidadesInput>
    where?: UnidadeFederativaWhereInput
  }

  export type UnidadeFederativaUpdateToOneWithWhereWithoutCidadesInput = {
    where?: UnidadeFederativaWhereInput
    data: XOR<UnidadeFederativaUpdateWithoutCidadesInput, UnidadeFederativaUncheckedUpdateWithoutCidadesInput>
  }

  export type UnidadeFederativaUpdateWithoutCidadesInput = {
    sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    regiao?: EnumRegiaoFieldUpdateOperationsInput | $Enums.Regiao
  }

  export type UnidadeFederativaUncheckedUpdateWithoutCidadesInput = {
    sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    regiao?: EnumRegiaoFieldUpdateOperationsInput | $Enums.Regiao
  }

  export type BairroUpsertWithWhereUniqueWithoutCidadeInput = {
    where: BairroWhereUniqueInput
    update: XOR<BairroUpdateWithoutCidadeInput, BairroUncheckedUpdateWithoutCidadeInput>
    create: XOR<BairroCreateWithoutCidadeInput, BairroUncheckedCreateWithoutCidadeInput>
  }

  export type BairroUpdateWithWhereUniqueWithoutCidadeInput = {
    where: BairroWhereUniqueInput
    data: XOR<BairroUpdateWithoutCidadeInput, BairroUncheckedUpdateWithoutCidadeInput>
  }

  export type BairroUpdateManyWithWhereWithoutCidadeInput = {
    where: BairroScalarWhereInput
    data: XOR<BairroUpdateManyMutationInput, BairroUncheckedUpdateManyWithoutCidadeInput>
  }

  export type BairroScalarWhereInput = {
    AND?: BairroScalarWhereInput | BairroScalarWhereInput[]
    OR?: BairroScalarWhereInput[]
    NOT?: BairroScalarWhereInput | BairroScalarWhereInput[]
    id?: BigIntFilter<"Bairro"> | bigint | number
    nome?: StringFilter<"Bairro"> | string
    cidade_id?: IntFilter<"Bairro"> | number
  }

  export type CidadeCreateWithoutBairrosInput = {
    nome: string
    cep?: string | null
    padrao?: boolean
    uf: UnidadeFederativaCreateNestedOneWithoutCidadesInput
  }

  export type CidadeUncheckedCreateWithoutBairrosInput = {
    id?: number
    uf_sigla: $Enums.SiglaUF
    nome: string
    cep?: string | null
    padrao?: boolean
  }

  export type CidadeCreateOrConnectWithoutBairrosInput = {
    where: CidadeWhereUniqueInput
    create: XOR<CidadeCreateWithoutBairrosInput, CidadeUncheckedCreateWithoutBairrosInput>
  }

  export type LogradouroCreateWithoutBairroInput = {
    id?: bigint | number
    nome: string
    cep: string
    tipo?: string | null
    enderecos?: EnderecoCreateNestedManyWithoutLogradouroInput
  }

  export type LogradouroUncheckedCreateWithoutBairroInput = {
    id?: bigint | number
    nome: string
    cep: string
    tipo?: string | null
    enderecos?: EnderecoUncheckedCreateNestedManyWithoutLogradouroInput
  }

  export type LogradouroCreateOrConnectWithoutBairroInput = {
    where: LogradouroWhereUniqueInput
    create: XOR<LogradouroCreateWithoutBairroInput, LogradouroUncheckedCreateWithoutBairroInput>
  }

  export type LogradouroCreateManyBairroInputEnvelope = {
    data: LogradouroCreateManyBairroInput | LogradouroCreateManyBairroInput[]
    skipDuplicates?: boolean
  }

  export type CidadeUpsertWithoutBairrosInput = {
    update: XOR<CidadeUpdateWithoutBairrosInput, CidadeUncheckedUpdateWithoutBairrosInput>
    create: XOR<CidadeCreateWithoutBairrosInput, CidadeUncheckedCreateWithoutBairrosInput>
    where?: CidadeWhereInput
  }

  export type CidadeUpdateToOneWithWhereWithoutBairrosInput = {
    where?: CidadeWhereInput
    data: XOR<CidadeUpdateWithoutBairrosInput, CidadeUncheckedUpdateWithoutBairrosInput>
  }

  export type CidadeUpdateWithoutBairrosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    uf?: UnidadeFederativaUpdateOneRequiredWithoutCidadesNestedInput
  }

  export type CidadeUncheckedUpdateWithoutBairrosInput = {
    id?: IntFieldUpdateOperationsInput | number
    uf_sigla?: EnumSiglaUFFieldUpdateOperationsInput | $Enums.SiglaUF
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LogradouroUpsertWithWhereUniqueWithoutBairroInput = {
    where: LogradouroWhereUniqueInput
    update: XOR<LogradouroUpdateWithoutBairroInput, LogradouroUncheckedUpdateWithoutBairroInput>
    create: XOR<LogradouroCreateWithoutBairroInput, LogradouroUncheckedCreateWithoutBairroInput>
  }

  export type LogradouroUpdateWithWhereUniqueWithoutBairroInput = {
    where: LogradouroWhereUniqueInput
    data: XOR<LogradouroUpdateWithoutBairroInput, LogradouroUncheckedUpdateWithoutBairroInput>
  }

  export type LogradouroUpdateManyWithWhereWithoutBairroInput = {
    where: LogradouroScalarWhereInput
    data: XOR<LogradouroUpdateManyMutationInput, LogradouroUncheckedUpdateManyWithoutBairroInput>
  }

  export type LogradouroScalarWhereInput = {
    AND?: LogradouroScalarWhereInput | LogradouroScalarWhereInput[]
    OR?: LogradouroScalarWhereInput[]
    NOT?: LogradouroScalarWhereInput | LogradouroScalarWhereInput[]
    id?: BigIntFilter<"Logradouro"> | bigint | number
    nome?: StringFilter<"Logradouro"> | string
    cep?: StringFilter<"Logradouro"> | string
    bairro_id?: BigIntFilter<"Logradouro"> | bigint | number
    tipo?: StringNullableFilter<"Logradouro"> | string | null
  }

  export type BairroCreateWithoutLogradouroInput = {
    id?: bigint | number
    nome: string
    cidade: CidadeCreateNestedOneWithoutBairrosInput
  }

  export type BairroUncheckedCreateWithoutLogradouroInput = {
    id?: bigint | number
    nome: string
    cidade_id: number
  }

  export type BairroCreateOrConnectWithoutLogradouroInput = {
    where: BairroWhereUniqueInput
    create: XOR<BairroCreateWithoutLogradouroInput, BairroUncheckedCreateWithoutLogradouroInput>
  }

  export type EnderecoCreateWithoutLogradouroInput = {
    numero: string
    complemento?: string | null
    referencia?: string | null
    pessoa: PessoaCreateNestedOneWithoutEnderecosInput
  }

  export type EnderecoUncheckedCreateWithoutLogradouroInput = {
    pessoa_id: string
    numero: string
    complemento?: string | null
    referencia?: string | null
  }

  export type EnderecoCreateOrConnectWithoutLogradouroInput = {
    where: EnderecoWhereUniqueInput
    create: XOR<EnderecoCreateWithoutLogradouroInput, EnderecoUncheckedCreateWithoutLogradouroInput>
  }

  export type EnderecoCreateManyLogradouroInputEnvelope = {
    data: EnderecoCreateManyLogradouroInput | EnderecoCreateManyLogradouroInput[]
    skipDuplicates?: boolean
  }

  export type BairroUpsertWithoutLogradouroInput = {
    update: XOR<BairroUpdateWithoutLogradouroInput, BairroUncheckedUpdateWithoutLogradouroInput>
    create: XOR<BairroCreateWithoutLogradouroInput, BairroUncheckedCreateWithoutLogradouroInput>
    where?: BairroWhereInput
  }

  export type BairroUpdateToOneWithWhereWithoutLogradouroInput = {
    where?: BairroWhereInput
    data: XOR<BairroUpdateWithoutLogradouroInput, BairroUncheckedUpdateWithoutLogradouroInput>
  }

  export type BairroUpdateWithoutLogradouroInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: CidadeUpdateOneRequiredWithoutBairrosNestedInput
  }

  export type BairroUncheckedUpdateWithoutLogradouroInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cidade_id?: IntFieldUpdateOperationsInput | number
  }

  export type EnderecoUpsertWithWhereUniqueWithoutLogradouroInput = {
    where: EnderecoWhereUniqueInput
    update: XOR<EnderecoUpdateWithoutLogradouroInput, EnderecoUncheckedUpdateWithoutLogradouroInput>
    create: XOR<EnderecoCreateWithoutLogradouroInput, EnderecoUncheckedCreateWithoutLogradouroInput>
  }

  export type EnderecoUpdateWithWhereUniqueWithoutLogradouroInput = {
    where: EnderecoWhereUniqueInput
    data: XOR<EnderecoUpdateWithoutLogradouroInput, EnderecoUncheckedUpdateWithoutLogradouroInput>
  }

  export type EnderecoUpdateManyWithWhereWithoutLogradouroInput = {
    where: EnderecoScalarWhereInput
    data: XOR<EnderecoUpdateManyMutationInput, EnderecoUncheckedUpdateManyWithoutLogradouroInput>
  }

  export type EnderecoScalarWhereInput = {
    AND?: EnderecoScalarWhereInput | EnderecoScalarWhereInput[]
    OR?: EnderecoScalarWhereInput[]
    NOT?: EnderecoScalarWhereInput | EnderecoScalarWhereInput[]
    logradouro_id?: BigIntFilter<"Endereco"> | bigint | number
    pessoa_id?: StringFilter<"Endereco"> | string
    numero?: StringFilter<"Endereco"> | string
    complemento?: StringNullableFilter<"Endereco"> | string | null
    referencia?: StringNullableFilter<"Endereco"> | string | null
  }

  export type EnderecoCreateWithoutPessoaInput = {
    numero: string
    complemento?: string | null
    referencia?: string | null
    logradouro: LogradouroCreateNestedOneWithoutEnderecosInput
  }

  export type EnderecoUncheckedCreateWithoutPessoaInput = {
    logradouro_id: bigint | number
    numero: string
    complemento?: string | null
    referencia?: string | null
  }

  export type EnderecoCreateOrConnectWithoutPessoaInput = {
    where: EnderecoWhereUniqueInput
    create: XOR<EnderecoCreateWithoutPessoaInput, EnderecoUncheckedCreateWithoutPessoaInput>
  }

  export type EnderecoCreateManyPessoaInputEnvelope = {
    data: EnderecoCreateManyPessoaInput | EnderecoCreateManyPessoaInput[]
    skipDuplicates?: boolean
  }

  export type ProfissionalCreateWithoutPessoaInput = {
    titulo: string
  }

  export type ProfissionalUncheckedCreateWithoutPessoaInput = {
    titulo: string
  }

  export type ProfissionalCreateOrConnectWithoutPessoaInput = {
    where: ProfissionalWhereUniqueInput
    create: XOR<ProfissionalCreateWithoutPessoaInput, ProfissionalUncheckedCreateWithoutPessoaInput>
  }

  export type servico_clienteCreateWithoutPessoaInput = {
    id?: bigint | number
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
    fotos?: servico_cliente_fotoCreateNestedManyWithoutServico_clienteInput
  }

  export type servico_clienteUncheckedCreateWithoutPessoaInput = {
    id?: bigint | number
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
    fotos?: servico_cliente_fotoUncheckedCreateNestedManyWithoutServico_clienteInput
  }

  export type servico_clienteCreateOrConnectWithoutPessoaInput = {
    where: servico_clienteWhereUniqueInput
    create: XOR<servico_clienteCreateWithoutPessoaInput, servico_clienteUncheckedCreateWithoutPessoaInput>
  }

  export type servico_clienteCreateManyPessoaInputEnvelope = {
    data: servico_clienteCreateManyPessoaInput | servico_clienteCreateManyPessoaInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutPessoaInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPessoaInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPessoaInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPessoaInput, UserUncheckedCreateWithoutPessoaInput>
  }

  export type EnderecoUpsertWithWhereUniqueWithoutPessoaInput = {
    where: EnderecoWhereUniqueInput
    update: XOR<EnderecoUpdateWithoutPessoaInput, EnderecoUncheckedUpdateWithoutPessoaInput>
    create: XOR<EnderecoCreateWithoutPessoaInput, EnderecoUncheckedCreateWithoutPessoaInput>
  }

  export type EnderecoUpdateWithWhereUniqueWithoutPessoaInput = {
    where: EnderecoWhereUniqueInput
    data: XOR<EnderecoUpdateWithoutPessoaInput, EnderecoUncheckedUpdateWithoutPessoaInput>
  }

  export type EnderecoUpdateManyWithWhereWithoutPessoaInput = {
    where: EnderecoScalarWhereInput
    data: XOR<EnderecoUpdateManyMutationInput, EnderecoUncheckedUpdateManyWithoutPessoaInput>
  }

  export type ProfissionalUpsertWithoutPessoaInput = {
    update: XOR<ProfissionalUpdateWithoutPessoaInput, ProfissionalUncheckedUpdateWithoutPessoaInput>
    create: XOR<ProfissionalCreateWithoutPessoaInput, ProfissionalUncheckedCreateWithoutPessoaInput>
    where?: ProfissionalWhereInput
  }

  export type ProfissionalUpdateToOneWithWhereWithoutPessoaInput = {
    where?: ProfissionalWhereInput
    data: XOR<ProfissionalUpdateWithoutPessoaInput, ProfissionalUncheckedUpdateWithoutPessoaInput>
  }

  export type ProfissionalUpdateWithoutPessoaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
  }

  export type ProfissionalUncheckedUpdateWithoutPessoaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
  }

  export type servico_clienteUpsertWithWhereUniqueWithoutPessoaInput = {
    where: servico_clienteWhereUniqueInput
    update: XOR<servico_clienteUpdateWithoutPessoaInput, servico_clienteUncheckedUpdateWithoutPessoaInput>
    create: XOR<servico_clienteCreateWithoutPessoaInput, servico_clienteUncheckedCreateWithoutPessoaInput>
  }

  export type servico_clienteUpdateWithWhereUniqueWithoutPessoaInput = {
    where: servico_clienteWhereUniqueInput
    data: XOR<servico_clienteUpdateWithoutPessoaInput, servico_clienteUncheckedUpdateWithoutPessoaInput>
  }

  export type servico_clienteUpdateManyWithWhereWithoutPessoaInput = {
    where: servico_clienteScalarWhereInput
    data: XOR<servico_clienteUpdateManyMutationInput, servico_clienteUncheckedUpdateManyWithoutPessoaInput>
  }

  export type servico_clienteScalarWhereInput = {
    AND?: servico_clienteScalarWhereInput | servico_clienteScalarWhereInput[]
    OR?: servico_clienteScalarWhereInput[]
    NOT?: servico_clienteScalarWhereInput | servico_clienteScalarWhereInput[]
    id?: BigIntFilter<"servico_cliente"> | bigint | number
    pessoa_id?: StringFilter<"servico_cliente"> | string
    titulo?: StringFilter<"servico_cliente"> | string
    descricao?: StringFilter<"servico_cliente"> | string
    data_hora_agendamento?: DateTimeFilter<"servico_cliente"> | Date | string
    valor_oferecido?: DecimalNullableFilter<"servico_cliente"> | Decimal | DecimalJsLike | number | string | null
    status?: Enumenum_servico_cliente_statusNullableFilter<"servico_cliente"> | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFilter<"servico_cliente"> | Date | string
  }

  export type UserUpsertWithoutPessoaInput = {
    update: XOR<UserUpdateWithoutPessoaInput, UserUncheckedUpdateWithoutPessoaInput>
    create: XOR<UserCreateWithoutPessoaInput, UserUncheckedCreateWithoutPessoaInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPessoaInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPessoaInput, UserUncheckedUpdateWithoutPessoaInput>
  }

  export type UserUpdateWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LogradouroCreateWithoutEnderecosInput = {
    id?: bigint | number
    nome: string
    cep: string
    tipo?: string | null
    bairro: BairroCreateNestedOneWithoutLogradouroInput
  }

  export type LogradouroUncheckedCreateWithoutEnderecosInput = {
    id?: bigint | number
    nome: string
    cep: string
    bairro_id: bigint | number
    tipo?: string | null
  }

  export type LogradouroCreateOrConnectWithoutEnderecosInput = {
    where: LogradouroWhereUniqueInput
    create: XOR<LogradouroCreateWithoutEnderecosInput, LogradouroUncheckedCreateWithoutEnderecosInput>
  }

  export type PessoaCreateWithoutEnderecosInput = {
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    profissional?: ProfissionalCreateNestedOneWithoutPessoaInput
    servico_cliente?: servico_clienteCreateNestedManyWithoutPessoaInput
    usuario: UserCreateNestedOneWithoutPessoaInput
  }

  export type PessoaUncheckedCreateWithoutEnderecosInput = {
    id: string
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    profissional?: ProfissionalUncheckedCreateNestedOneWithoutPessoaInput
    servico_cliente?: servico_clienteUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaCreateOrConnectWithoutEnderecosInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutEnderecosInput, PessoaUncheckedCreateWithoutEnderecosInput>
  }

  export type LogradouroUpsertWithoutEnderecosInput = {
    update: XOR<LogradouroUpdateWithoutEnderecosInput, LogradouroUncheckedUpdateWithoutEnderecosInput>
    create: XOR<LogradouroCreateWithoutEnderecosInput, LogradouroUncheckedCreateWithoutEnderecosInput>
    where?: LogradouroWhereInput
  }

  export type LogradouroUpdateToOneWithWhereWithoutEnderecosInput = {
    where?: LogradouroWhereInput
    data: XOR<LogradouroUpdateWithoutEnderecosInput, LogradouroUncheckedUpdateWithoutEnderecosInput>
  }

  export type LogradouroUpdateWithoutEnderecosInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: BairroUpdateOneRequiredWithoutLogradouroNestedInput
  }

  export type LogradouroUncheckedUpdateWithoutEnderecosInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    bairro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PessoaUpsertWithoutEnderecosInput = {
    update: XOR<PessoaUpdateWithoutEnderecosInput, PessoaUncheckedUpdateWithoutEnderecosInput>
    create: XOR<PessoaCreateWithoutEnderecosInput, PessoaUncheckedCreateWithoutEnderecosInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutEnderecosInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutEnderecosInput, PessoaUncheckedUpdateWithoutEnderecosInput>
  }

  export type PessoaUpdateWithoutEnderecosInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    profissional?: ProfissionalUpdateOneWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUpdateManyWithoutPessoaNestedInput
    usuario?: UserUpdateOneRequiredWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateWithoutEnderecosInput = {
    id?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    profissional?: ProfissionalUncheckedUpdateOneWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaCreateWithoutProfissionalInput = {
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoCreateNestedManyWithoutPessoaInput
    servico_cliente?: servico_clienteCreateNestedManyWithoutPessoaInput
    usuario: UserCreateNestedOneWithoutPessoaInput
  }

  export type PessoaUncheckedCreateWithoutProfissionalInput = {
    id: string
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoUncheckedCreateNestedManyWithoutPessoaInput
    servico_cliente?: servico_clienteUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaCreateOrConnectWithoutProfissionalInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutProfissionalInput, PessoaUncheckedCreateWithoutProfissionalInput>
  }

  export type PessoaUpsertWithoutProfissionalInput = {
    update: XOR<PessoaUpdateWithoutProfissionalInput, PessoaUncheckedUpdateWithoutProfissionalInput>
    create: XOR<PessoaCreateWithoutProfissionalInput, PessoaUncheckedCreateWithoutProfissionalInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutProfissionalInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutProfissionalInput, PessoaUncheckedUpdateWithoutProfissionalInput>
  }

  export type PessoaUpdateWithoutProfissionalInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUpdateManyWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUpdateManyWithoutPessoaNestedInput
    usuario?: UserUpdateOneRequiredWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateWithoutProfissionalInput = {
    id?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUncheckedUpdateManyWithoutPessoaNestedInput
    servico_cliente?: servico_clienteUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaCreateWithoutServico_clienteInput = {
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoCreateNestedManyWithoutPessoaInput
    profissional?: ProfissionalCreateNestedOneWithoutPessoaInput
    usuario: UserCreateNestedOneWithoutPessoaInput
  }

  export type PessoaUncheckedCreateWithoutServico_clienteInput = {
    id: string
    cpf: string
    nascimento: Date | string
    celular: string
    criado_em?: Date | string
    atualizado_em?: Date | string
    enderecos?: EnderecoUncheckedCreateNestedManyWithoutPessoaInput
    profissional?: ProfissionalUncheckedCreateNestedOneWithoutPessoaInput
  }

  export type PessoaCreateOrConnectWithoutServico_clienteInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutServico_clienteInput, PessoaUncheckedCreateWithoutServico_clienteInput>
  }

  export type servico_cliente_fotoCreateWithoutServico_clienteInput = {
    md5: string
    uri_img: string
    ordem: number
  }

  export type servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput = {
    md5: string
    uri_img: string
    ordem: number
  }

  export type servico_cliente_fotoCreateOrConnectWithoutServico_clienteInput = {
    where: servico_cliente_fotoWhereUniqueInput
    create: XOR<servico_cliente_fotoCreateWithoutServico_clienteInput, servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput>
  }

  export type servico_cliente_fotoCreateManyServico_clienteInputEnvelope = {
    data: servico_cliente_fotoCreateManyServico_clienteInput | servico_cliente_fotoCreateManyServico_clienteInput[]
    skipDuplicates?: boolean
  }

  export type PessoaUpsertWithoutServico_clienteInput = {
    update: XOR<PessoaUpdateWithoutServico_clienteInput, PessoaUncheckedUpdateWithoutServico_clienteInput>
    create: XOR<PessoaCreateWithoutServico_clienteInput, PessoaUncheckedCreateWithoutServico_clienteInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutServico_clienteInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutServico_clienteInput, PessoaUncheckedUpdateWithoutServico_clienteInput>
  }

  export type PessoaUpdateWithoutServico_clienteInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUpdateManyWithoutPessoaNestedInput
    profissional?: ProfissionalUpdateOneWithoutPessoaNestedInput
    usuario?: UserUpdateOneRequiredWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateWithoutServico_clienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    nascimento?: DateTimeFieldUpdateOperationsInput | Date | string
    celular?: StringFieldUpdateOperationsInput | string
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoUncheckedUpdateManyWithoutPessoaNestedInput
    profissional?: ProfissionalUncheckedUpdateOneWithoutPessoaNestedInput
  }

  export type servico_cliente_fotoUpsertWithWhereUniqueWithoutServico_clienteInput = {
    where: servico_cliente_fotoWhereUniqueInput
    update: XOR<servico_cliente_fotoUpdateWithoutServico_clienteInput, servico_cliente_fotoUncheckedUpdateWithoutServico_clienteInput>
    create: XOR<servico_cliente_fotoCreateWithoutServico_clienteInput, servico_cliente_fotoUncheckedCreateWithoutServico_clienteInput>
  }

  export type servico_cliente_fotoUpdateWithWhereUniqueWithoutServico_clienteInput = {
    where: servico_cliente_fotoWhereUniqueInput
    data: XOR<servico_cliente_fotoUpdateWithoutServico_clienteInput, servico_cliente_fotoUncheckedUpdateWithoutServico_clienteInput>
  }

  export type servico_cliente_fotoUpdateManyWithWhereWithoutServico_clienteInput = {
    where: servico_cliente_fotoScalarWhereInput
    data: XOR<servico_cliente_fotoUpdateManyMutationInput, servico_cliente_fotoUncheckedUpdateManyWithoutServico_clienteInput>
  }

  export type servico_cliente_fotoScalarWhereInput = {
    AND?: servico_cliente_fotoScalarWhereInput | servico_cliente_fotoScalarWhereInput[]
    OR?: servico_cliente_fotoScalarWhereInput[]
    NOT?: servico_cliente_fotoScalarWhereInput | servico_cliente_fotoScalarWhereInput[]
    servico_cliente_id?: BigIntFilter<"servico_cliente_foto"> | bigint | number
    md5?: StringFilter<"servico_cliente_foto"> | string
    uri_img?: StringFilter<"servico_cliente_foto"> | string
    ordem?: IntFilter<"servico_cliente_foto"> | number
  }

  export type servico_clienteCreateWithoutFotosInput = {
    id?: bigint | number
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
    pessoa: PessoaCreateNestedOneWithoutServico_clienteInput
  }

  export type servico_clienteUncheckedCreateWithoutFotosInput = {
    id?: bigint | number
    pessoa_id: string
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
  }

  export type servico_clienteCreateOrConnectWithoutFotosInput = {
    where: servico_clienteWhereUniqueInput
    create: XOR<servico_clienteCreateWithoutFotosInput, servico_clienteUncheckedCreateWithoutFotosInput>
  }

  export type servico_clienteUpsertWithoutFotosInput = {
    update: XOR<servico_clienteUpdateWithoutFotosInput, servico_clienteUncheckedUpdateWithoutFotosInput>
    create: XOR<servico_clienteCreateWithoutFotosInput, servico_clienteUncheckedCreateWithoutFotosInput>
    where?: servico_clienteWhereInput
  }

  export type servico_clienteUpdateToOneWithWhereWithoutFotosInput = {
    where?: servico_clienteWhereInput
    data: XOR<servico_clienteUpdateWithoutFotosInput, servico_clienteUncheckedUpdateWithoutFotosInput>
  }

  export type servico_clienteUpdateWithoutFotosInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    pessoa?: PessoaUpdateOneRequiredWithoutServico_clienteNestedInput
  }

  export type servico_clienteUncheckedUpdateWithoutFotosInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    pessoa_id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AccountCreateManyUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CidadeCreateManyUfInput = {
    id?: number
    nome: string
    cep?: string | null
    padrao?: boolean
  }

  export type CidadeUpdateWithoutUfInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    bairros?: BairroUpdateManyWithoutCidadeNestedInput
  }

  export type CidadeUncheckedUpdateWithoutUfInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    bairros?: BairroUncheckedUpdateManyWithoutCidadeNestedInput
  }

  export type CidadeUncheckedUpdateManyWithoutUfInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BairroCreateManyCidadeInput = {
    id?: bigint | number
    nome: string
  }

  export type BairroUpdateWithoutCidadeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    logradouro?: LogradouroUpdateManyWithoutBairroNestedInput
  }

  export type BairroUncheckedUpdateWithoutCidadeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    logradouro?: LogradouroUncheckedUpdateManyWithoutBairroNestedInput
  }

  export type BairroUncheckedUpdateManyWithoutCidadeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type LogradouroCreateManyBairroInput = {
    id?: bigint | number
    nome: string
    cep: string
    tipo?: string | null
  }

  export type LogradouroUpdateWithoutBairroInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
    enderecos?: EnderecoUpdateManyWithoutLogradouroNestedInput
  }

  export type LogradouroUncheckedUpdateWithoutBairroInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
    enderecos?: EnderecoUncheckedUpdateManyWithoutLogradouroNestedInput
  }

  export type LogradouroUncheckedUpdateManyWithoutBairroInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nome?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    tipo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnderecoCreateManyLogradouroInput = {
    pessoa_id: string
    numero: string
    complemento?: string | null
    referencia?: string | null
  }

  export type EnderecoUpdateWithoutLogradouroInput = {
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    pessoa?: PessoaUpdateOneRequiredWithoutEnderecosNestedInput
  }

  export type EnderecoUncheckedUpdateWithoutLogradouroInput = {
    pessoa_id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnderecoUncheckedUpdateManyWithoutLogradouroInput = {
    pessoa_id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnderecoCreateManyPessoaInput = {
    logradouro_id: bigint | number
    numero: string
    complemento?: string | null
    referencia?: string | null
  }

  export type servico_clienteCreateManyPessoaInput = {
    id?: bigint | number
    titulo: string
    descricao: string
    data_hora_agendamento: Date | string
    valor_oferecido?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.enum_servico_cliente_status | null
    criado_em?: Date | string
  }

  export type EnderecoUpdateWithoutPessoaInput = {
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    logradouro?: LogradouroUpdateOneRequiredWithoutEnderecosNestedInput
  }

  export type EnderecoUncheckedUpdateWithoutPessoaInput = {
    logradouro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnderecoUncheckedUpdateManyWithoutPessoaInput = {
    logradouro_id?: BigIntFieldUpdateOperationsInput | bigint | number
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type servico_clienteUpdateWithoutPessoaInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    fotos?: servico_cliente_fotoUpdateManyWithoutServico_clienteNestedInput
  }

  export type servico_clienteUncheckedUpdateWithoutPessoaInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    fotos?: servico_cliente_fotoUncheckedUpdateManyWithoutServico_clienteNestedInput
  }

  export type servico_clienteUncheckedUpdateManyWithoutPessoaInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data_hora_agendamento?: DateTimeFieldUpdateOperationsInput | Date | string
    valor_oferecido?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableEnumenum_servico_cliente_statusFieldUpdateOperationsInput | $Enums.enum_servico_cliente_status | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type servico_cliente_fotoCreateManyServico_clienteInput = {
    md5: string
    uri_img: string
    ordem: number
  }

  export type servico_cliente_fotoUpdateWithoutServico_clienteInput = {
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type servico_cliente_fotoUncheckedUpdateWithoutServico_clienteInput = {
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type servico_cliente_fotoUncheckedUpdateManyWithoutServico_clienteInput = {
    md5?: StringFieldUpdateOperationsInput | string
    uri_img?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}