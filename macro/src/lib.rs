#![recursion_limit = "128"]

extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Ruleset)]
pub fn derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    let fields = if let syn::Data::Struct(syn::DataStruct {
        fields: syn::Fields::Named(syn::FieldsNamed { ref named, .. }),
        ..
    }) = ast.data
    {
        named
    } else {
        panic!("No fields found");
    };

    let is_option_t = |ty: &syn::Type| -> bool {
        if let syn::Type::Path(ref p) = ty {
            if p.path.segments.len() != 1 || p.path.segments[0].ident != "Option" {
                return false;
            }
            if let syn::PathArguments::AngleBracketed(ref inner_ty) = p.path.segments[0].arguments {
                if inner_ty.args.len() != 1 {
                    return false;
                } else if let syn::GenericArgument::Type(ref _ty) = inner_ty.args.first().unwrap() {
                    return true;
                }
            }
        }
        false
    };

    let unwrap_option_t = |ty: &syn::Type| -> syn::Type {
        if let syn::Type::Path(ref p) = ty {
            if p.path.segments.len() != 1 || p.path.segments[0].ident != "Option" {
                panic!("Type was not Option<T>");
            }
            if let syn::PathArguments::AngleBracketed(ref inner_ty) = p.path.segments[0].arguments {
                if inner_ty.args.len() != 1 {
                    panic!("Option type was not Option<T>");
                } else if let syn::GenericArgument::Type(ref ty) = inner_ty.args.first().unwrap() {
                    return ty.clone();
                }
            }
        }
        panic!("Type was not Option<T>");
    };

    let enabled = fields.iter().map(|f| {
        let name = &f.ident;

        if is_option_t(&f.ty) {
            quote! {
                if let Some(#name) = &self.#name {
                    conditions.push(#name);
                }
            }
        } else {
            quote! {}
        }
    });

    let struct_size = fields.iter().map(|f| {
        let name = &f.ident;

        if is_option_t(&f.ty) {
            let ty = unwrap_option_t(&f.ty);
            quote! {
                if self.#name.is_some() {
                    size += #ty::size();
                }
            }
        } else {
            quote! {}
        }
    });

    let expanded = quote! {
        impl #name {
            pub fn enabled_conditions(&self) -> Vec<&dyn Condition> {
                // list of condition trait objects
                let mut conditions: Vec<&dyn Condition> = vec![];
                #(#enabled)*

                conditions
            }

            pub fn size(&self) -> usize {
                let mut size = 0;
                #(#struct_size)*
                size
            }
        }
    };

    TokenStream::from(expanded)
}
