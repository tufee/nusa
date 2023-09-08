import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('receitas', function (table) {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('medico_id').references('id').inTable('medicos');
    table.uuid('paciente_id').references('id').inTable('pacientes');
    table.uuid('medicamento_id').references('id').inTable('medicamentos');
    table.date('data_prescricao').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('receitas');
}
