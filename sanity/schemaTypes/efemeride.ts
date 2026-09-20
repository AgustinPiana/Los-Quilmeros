import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'efemeride',
  title: 'Efeméride',
  type: 'document',
  fields: [
    defineField({
      name: 'dia',
      title: 'Día del mes',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(31),
    }),
    defineField({
      name: 'mes',
      title: 'Mes',
      type: 'number',
      description: '1 = enero ... 12 = diciembre',
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
    defineField({
      name: 'anioHistorico',
      title: 'Año del hecho histórico',
      type: 'number',
      description: 'Ej: 1812. Se muestra como dato de referencia, no define cuándo aparece en el calendario.',
    }),
    defineField({
      name: 'titulo',
      title: 'Título breve',
      type: 'string',
      description: 'Se muestra en la tarjeta del calendario. Ej: "Quilmes, territorio libre".',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'texto',
      title: 'Texto completo',
      type: 'text',
      rows: 6,
      description: 'El desarrollo del hecho histórico. Redactado y validado por la asociación.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: 'Fundacional', value: 'fundacional'},
          {title: 'Institucional', value: 'institucional'},
          {title: 'Personalidades', value: 'personalidades'},
          {title: 'Patrimonio', value: 'patrimonio'},
          {title: 'Barrios y localidades', value: 'barrios'},
          {title: 'Otra', value: 'otra'},
        ],
      },
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen (opcional)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'destacada',
      title: '¿Destacar en la home?',
      type: 'boolean',
      description: 'Si está activo y la fecha coincide con hoy, aparece en la tarjeta principal de la home.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'titulo', dia: 'dia', mes: 'mes', anio: 'anioHistorico'},
    prepare({title, dia, mes, anio}) {
      const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
      const fecha = dia && mes ? `${dia} ${meses[mes - 1]}` : 'sin fecha'
      return {title, subtitle: anio ? `${fecha} · ${anio}` : fecha}
    },
  },
})
