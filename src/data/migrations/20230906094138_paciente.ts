import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pacientes', function (table) {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('nome').notNullable();
    table.string('cpf').unique().notNullable();
    table.date('data_nascimento').notNullable();
    table.string('senha').notNullable();
    table.string('tipo').defaultTo('paciente');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('pacientes');
}
