import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('medicamentos', function (table) {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('nome').notNullable();
    table.string('categoria').notNullable();
    table.string('codigo_anvisa').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('medicamentos');
}
