import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'autoridad',
  title: 'Autoridad',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre y apellido',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cargo',
      title: 'Cargo',
      type: 'string',
      description: 'Ej: Presidente, Vicepresidente, Secretario, Tesorero, Vocal...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Fotografía',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'descripcion',
      title: 'Breve descripción',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número más bajo aparece primero (ej: Presidente = 1).',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Orden de aparición',
      name: 'ordenAsc',
      by: [{field: 'orden', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'nombre', subtitle: 'cargo', media: 'foto'},
  },
})
